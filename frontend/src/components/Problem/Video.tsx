import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import io, { Socket } from 'socket.io-client';
import { Peer } from 'peerjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { socketState } from '../../recoils';

const VideoContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
  min-height: 9rem; // Minimum height for at least one video
  display: flex;
  flex-direction: column; // Stack children vertically
  justify-content: flex-start; // Align children to the top of the container
  align-items: center; // Center align horizontally
  overflow: auto; // Allows scrolling when content exceeds the container's height
`;

const UserVideoContainer = styled.video`
  max-width: 16rem;
  width: 100%; // Takes full width of the container
  max-height: 9rem;
  height: auto; // Maintain aspect ratio
  margin-bottom: 1rem; // Space between videos
  background-color: #FFFFFF; // 배경을 흰색으로 설정
`;

const DivWrapper = styled.div`
  position: relative;
  max-height: 9rem;
  width: 100%; // Ensure this matches the parent container width
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center; // Center align the video in this div

  video {
    width: 100%;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  left: 0.6rem;
  bottom: 0.9rem;
  display: flex;
`;

const ControllButton = styled.div`
  cursor: pointer;
  width: 100%;
  display: block;
  font-size: 1rem;
  text-align: center;
  z-index: 2;
`;

const Text = styled.div`
  font-size: 0.8rem;
  color: #777777;
  position: absolute;
  bottom: -1rem;
  left: 0;
  text-align: center;
  width: 100%;
`;

type ConstraintsType = {
  audio?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  video?: boolean | Object;
};

const videoSize = {
  width: {
    ideal: 1280,
  },
  height: {
    ideal: 720,
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
    <VideoContainer>
      {Object.entries(peers).map((user, idx) => (
          <UserVideoContainer
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
        <DivWrapper>
          <UserVideoContainer ref={videoRef} autoPlay muted playsInline />
          <ButtonContainer>
            <ControllButton onClick={handleMicButton}>
              {micOn ? '🔊' : '🔔'}
            </ControllButton>
            <ControllButton onClick={handleCameraButton}>
              {!videoOn ? '📸' : '🟥'}
            </ControllButton>
          </ButtonContainer>
          <Text>{text}</Text>
        </DivWrapper>
      </VideoContainer>
  );
};