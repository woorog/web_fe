
import React, { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Peer } from 'peerjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { socketState } from '../../recoils';

import { ReactComponent as Camera } from '../../assets/Camera.svg'; // SVG 아이콘 임포트
import { ReactComponent as Pause } from '../../assets/Pause.svg'; // SVG 아이콘 임포트
import { ReactComponent as Volume } from '../../assets/Volume.svg'; // SVG 아이콘 임포트
import { ReactComponent as VolumeSlash } from '../../assets/VolumeSlash.svg'; // SVG 아이콘 임포트

type ConstraintsType = {
  audio?: boolean;
  video?: boolean | Object;
};

const videoSize = {
  width: {
    ideal: 720,
  },
  height: {
    ideal: 405,
  },
};

const Constraints: ConstraintsType = {
  video: videoSize,
  audio: true,
};

export const Video = () => {
  const [myStream, setMyStream] = useState<MediaStream | undefined>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { roomNumber } = useParams();
  const [, setMyID] = useState('');
  const [peers, setPeers] = useState<any>({});
  const [videoOn, setVideoOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [text, setText] = useState('');
  const [btnWork, setBtnWork] = useState(false);
  const peerVideosRef = useRef<Array<HTMLVideoElement>>([]);
  const navigate = useNavigate();

  const [myPeer, setMyPeer] = useState<Peer>();
  const [socket, setSocket] = useRecoilState(socketState);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      setVideoOn(true);
      setMicOn(true);
      setMyStream(mediaStream);
      setMyPeer(new Peer());

      const socketUrl = import.meta.env.VITE_SOCKET_SERVER_URL;

      const newSocket = io(socketUrl, {
        path: '/socket-video/',
        secure: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      setSocket(newSocket);
    }).catch((error) => {
      console.error('Error accessing media devices:', error);
    });
  }, []);

  const callCallback = useCallback(
    (call: any) => {
      call.answer(myStream);
      call.on('stream', () => {
        setPeers({
          ...peers,
          ...{
            [call.peer]: call,
          },
        });
      });
      call.on('close', () => {
        return;
      });
    },
    [myStream, peers],
  );

  const connectCallback = useCallback(
    (userId: string) => {
      if (!myStream || !myPeer) {
        return;
      }
      const call = myPeer.call(userId, myStream);
      call.on('stream', () => {
        setPeers({
          ...peers,
          ...{
            [userId]: call,
          },
        });
      });

      call.on('close', () => {
        return;
      });
    },
    [myStream, peers, myPeer],
  );

  const disconnectCallback = useCallback(
    (userId: string) => {
      if (!peers[userId]) {
        return;
      }
      peers[userId].close();
      const temp = { ...peers };
      delete temp[userId];
      setPeers(temp);

      
    },
    [peers],
  );

  useEffect(() => {
    if (!myStream) {
      return;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    if (!myStream || !myPeer || !socket) {
      return;
    }
    myPeer.on('call', callCallback);
    socket.on('user-connected', connectCallback);

    return () => {
      myPeer.off('call', callCallback);
      socket.off('user-connected', connectCallback);
    };
  }, [myStream, callCallback, myPeer, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('user-disconnected', disconnectCallback);
    return () => {
      socket.off('user-disconnected', disconnectCallback);
    };
  }, [disconnectCallback, socket]);

  useEffect(() => {
    if (!myPeer || !socket) {
      return;
    }
    myPeer.on('open', (id) => {
      setMyID(id);
      socket.emit('join-room', roomNumber, id);
    });
  }, [myPeer, socket]);

  useEffect(() => {
    Object.values(peers).forEach((call, idx) => {
      // @ts-ignore
      peerVideosRef.current[idx].srcObject = call.remoteStream;
    });
  }, [peers]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('full', () => {
      alert('방이 꽉 찼습니다.');
      navigate('/');
    });
  }, [socket]);

  useEffect(() => {
    if (!myPeer || !socket) return;
    return () => {
      myPeer.destroy();
      socket.disconnect();
    };
  }, [myPeer, socket]);

  useEffect(() => {
    return () => {
      myStream?.getTracks().forEach((ele) => ele.stop());
    };
  }, [myStream]);

  const setTimeoutText = (text: string) => {
    setText(text);
    setTimeout(() => setText(''), 1500);
  };

  const sendStream = (updateConstraints: ConstraintsType) => {
    if (!myPeer) return;
    navigator.mediaDevices
      .getUserMedia(updateConstraints)
      .then((mediaStream) => {
        Object.keys(peers).forEach((elem) => {
          myPeer.call(elem, mediaStream);
        });
        setMyStream(mediaStream);
      })
      .catch(() => {
        setMyStream(undefined);
        if (!myStream) return;
        Object.keys(peers).forEach((elem) => {
          myPeer.call(elem, myStream);
        });
      })
      .finally(() => {
        setTimeout(() => {
          setBtnWork(false);
        }, 2000);
      });
  };

  const handleCameraButton = () => {
    if (btnWork) {
      setTimeoutText('잠시 기다려주세요');
      return;
    }
    setBtnWork(true);
    const updateConstraints: ConstraintsType = {};
    updateConstraints.video = !videoOn ? videoSize : false;
    updateConstraints.audio = micOn;
    setTimeoutText(`카메라 ${!videoOn ? 'ON' : 'OFF'}`);
    setVideoOn(!videoOn);
    sendStream(updateConstraints);
  };

  const handleMicButton = () => {
    if (btnWork) {
      setTimeoutText('잠시 기다려주세요');
      return;
    }
    setBtnWork(true);
    const updateConstraints: ConstraintsType = {};
    updateConstraints.video = videoOn ? videoSize : false;
    updateConstraints.audio = !micOn;
    setTimeoutText(`마이크 ${!micOn ? 'ON' : 'OFF'}`);
    setMicOn(!micOn);
    sendStream(updateConstraints);
  };

  return (
    <div className="mt-4 w-full min-h-28 flex flex-col justify-start items-center overflow-auto">
      {Object.entries(peers).map((user, idx) => (
        <video
          className="max-w-48 w-full max-h-28 h-auto mb-4 bg-white rounded-lg"
          autoPlay
          playsInline
          ref={(ele) => {
            if (ele) {
              peerVideosRef.current[idx] = ele;
            }
          }}
          key={idx}
        />
      ))}
      <div className="relative max-h-28 w-full h-auto flex flex-col items-center">
        <video
          className="max-w-48 w-full max-h-28 h-auto mb-4 bg-white rounded-lg"
          ref={videoRef}
          autoPlay
          muted
          playsInline
        />
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
          <div className="cursor-pointer text-base text-center z-10" onClick={handleMicButton}>
            {micOn ? <Volume className="w-5 h-5"/> : <VolumeSlash className="w-5 h-5"/>}
          </div>
          <div className="cursor-pointer text-base text-center z-10" onClick={handleCameraButton}>
            {!videoOn ? <Camera className="w-5 h-5"/> : <Pause className="w-5 h-5"/>}
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 text-center w-full">
          {text}
        </div>
      </div>
    </div>
  );
};
