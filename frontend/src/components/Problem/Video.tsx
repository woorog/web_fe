import React, { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Peer } from 'peerjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { socketState } from '../../recoils';
import { ReactMic } from 'react-mic';

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
  const [peers, setPeers] = useState<{ [id: string]: MediaStream }>({});
  const [videoOn, setVideoOn] = useState(false);
  const [text, setText] = useState('');
  const [btnWork, setBtnWork] = useState(false);
  const [recordedBlobSize, setRecordedBlobSize] = useState(0);
  const peerVideosRef = useRef<Array<HTMLVideoElement>>([]);
  const navigate = useNavigate();

  const [myPeer, setMyPeer] = useState<Peer>();
  const [socket, setSocket] = useRecoilState(socketState);
  const lastLogTimeRef = useRef(Date.now());

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        console.log('getUserMedia success:', mediaStream);
        setVideoOn(true);
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
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
        alert('Error accessing media devices: ' + error.message);
      });
  }, []);

  const handleMicData = (recordedBlob: any) => {
    const currentTime = Date.now();
    if (recordedBlob && recordedBlob.size > 0) {
      setRecordedBlobSize(recordedBlob.size);
      if (currentTime - lastLogTimeRef.current >= 10000) { // 10초마다 로그 출력
        console.log('recordedBlob size: ', recordedBlob.size);
        lastLogTimeRef.current = currentTime; // 마지막 로그 출력 시간 업데이트
      }
    } else {
      setRecordedBlobSize(0);
      console.log('recordedBlob size is 0 or undefined');
      if (currentTime - lastLogTimeRef.current >= 10000) { // 10초마다 로그 출력
        lastLogTimeRef.current = currentTime; // 마지막 로그 출력 시간 업데이트
      }
    }
  };

  const handleMicStop = (recordedBlob: any) => {
    console.log('Recorded Blob:', recordedBlob);
    setRecordedBlobSize(0);
  };

  const callCallback = useCallback(
    (call: any) => {
      call.answer(myStream);
      call.on('stream', (remoteStream: MediaStream) => {
        setPeers((prevPeers: { [id: string]: MediaStream }) => ({
          ...prevPeers,
          [call.peer]: remoteStream,
        }));
      });
      call.on('close', () => {
        setPeers((prevPeers: { [id: string]: MediaStream }) => {
          const updatedPeers = { ...prevPeers };
          delete updatedPeers[call.peer];
          return updatedPeers;
        });
      });
    },
    [myStream],
  );

  const connectCallback = useCallback(
    (userId: string) => {
      if (!myStream || !myPeer) {
        return;
      }
      const call = myPeer.call(userId, myStream);
      call.on('stream', (remoteStream: MediaStream) => {
        setPeers((prevPeers: { [id: string]: MediaStream }) => ({
          ...prevPeers,
          [userId]: remoteStream,
        }));
      });

      call.on('close', () => {
        setPeers((prevPeers: { [id: string]: MediaStream }) => {
          const updatedPeers = { ...prevPeers };
          delete updatedPeers[userId];
          return updatedPeers;
        });
      });
    },
    [myStream, myPeer],
  );

  const disconnectCallback = useCallback(
    (userId: string) => {
      setPeers((prevPeers: { [id: string]: MediaStream }) => {
        const updatedPeers = { ...prevPeers };
        delete updatedPeers[userId];
        return updatedPeers;
      });
    },
    [],
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
    updateConstraints.audio = recordedBlobSize > 0;
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
    const newMicOnStatus = recordedBlobSize === 0;
    updateConstraints.audio = newMicOnStatus;
    setTimeoutText(`마이크 ${newMicOnStatus ? 'ON' : 'OFF'}`);
    setRecordedBlobSize(newMicOnStatus ? 1000 : 0); // 마이크 끌 때 recordedBlob을 0으로 설정
    console.log('Mic button clicked. New Mic status:', newMicOnStatus);
    sendStream(updateConstraints);
  };

  useEffect(() => {
    if (recordedBlobSize > 1000) {
      const timer = setTimeout(() => {
        setRecordedBlobSize(1000); // 1.5초 후에 recordedBlobSize를 1000으로 설정
      }, 1500);
      return () => clearTimeout(timer); // 타이머를 정리하여 메모리 누수를 방지
    }
  }, [recordedBlobSize]);
  
  return (
    <div className="mt-4 w-full min-h-36 flex flex-col justify-start items-center overflow-auto">
      <ReactMic
        record={recordedBlobSize > 0}
        className="hidden"
        onStop={handleMicStop}
        onData={handleMicData}
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />
      {Object.entries(peers).map((user, idx) => (
        <div
          key={idx}
          className="relative max-w-48 w-full max-h-36 h-auto mb-4"
        >
          <div
            className={`absolute inset-0 rounded-lg ${recordedBlobSize > 1000 ? 'border-4 border-green-500' : 'bg-transparent'}`}
            style={{
              boxShadow: recordedBlobSize > 1000 ? '0 0 15px 5px rgba(0, 255, 0, 0.7)' : 'none',
              pointerEvents: 'none' // This ensures that the div does not interfere with video interactions
            }}
          ></div>
          <video
            className="relative w-full h-full object-cover rounded-lg"
            autoPlay
            playsInline
            ref={(ele) => {
              if (ele) {
                peerVideosRef.current[idx] = ele;
              }
            }}
          />
        </div>
      ))}
      <div className="relative max-h-36 w-full h-auto flex flex-col items-center">
        <div className="relative max-w-48 w-full max-h-36 h-auto mb-4">
          <div
            className={`absolute inset-0 rounded-lg ${recordedBlobSize > 1000 ? 'border-4 border-green-500' : 'bg-transparent'}`}
            style={{
              boxShadow: recordedBlobSize > 1000 ? '0 0 15px 5px rgba(0, 255, 0, 0.7)' : 'none',
              pointerEvents: 'none' // This ensures that the div does not interfere with video interactions
            }}
          ></div>
          <video
            className="relative w-full h-full object-cover rounded-lg"
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />
        </div>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
          <div className="cursor-pointer text-base text-center z-10" onClick={handleMicButton}>
            {recordedBlobSize > 0 ? <Volume className="w-5 h-5" /> : <VolumeSlash className="w-5 h-5" />}
          </div>
          <div className="cursor-pointer text-base text-center z-10" onClick={handleCameraButton}>
            {!videoOn ? <Camera className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 text-center w-full">
          {text}
        </div>
      </div>
    </div>
  );  
};