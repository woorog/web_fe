import React, { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import uuid from 'react-uuid';

type ProblemProps = {
    problemId: number;
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 20px;
    background: #f0f0f0;
`;

const StyledButton = styled.button`
    width: 95%;
    height: 50px;
    margin: 20px;
    border: none;
    border-radius: 10px;
    background-color: #000000;
    color: white;
    font-size: 1.8rem;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    z-index: 1;

    &:hover {
        background-color: #333333;
        color: #FFD700;
        text-shadow: 0 0 8px #FFFFFF;
    }
`;

const InputField = styled.input`
    width: 95%;
    height: 50px;
    margin: 20px;
    padding: 10px;
    font-size: 1.2rem;
    border-radius: 10px;
`;

const Problem = ({ problemId }: ProblemProps) => {
    const navigate = useNavigate();
    const [roomUrl, setRoomUrl] = useState('');

    const handleCreateRoom = () => {
        const room = btoa(uuid());
        localStorage.setItem(`problem${problemId}`, room);
        navigate(`/problem/multi/${problemId}/${room}`);
    };

    const handleJoinRoom = () => {
        if (roomUrl) {
            // 방 URL이 'http' 또는 'https'로 시작하는지 검사
            if (/^https?:\/\//.test(roomUrl)) {
                // 외부 URL로 직접 이동
                window.location.href = roomUrl;
            } else {
                // 내부 라우팅 처리
                navigate(roomUrl);
            }
        } else {
            alert("Please enter a valid room URL");
        }
    };

    return (
        <Container>
            <InputField
                type="text"
                placeholder="Enter room URL to join"
                value={roomUrl}
                onChange={(e) => setRoomUrl(e.target.value)}
            />
            <StyledButton onClick={handleJoinRoom}>방 참가하기</StyledButton>

            <StyledButton onClick={handleCreateRoom}>방 만들기</StyledButton>

        </Container>
    );
};

export default memo(Problem);
