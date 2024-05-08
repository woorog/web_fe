// import React, { memo, useEffect } from 'react';
// import styled from 'styled-components';
// import { ProblemType } from '@types';
// import { ProblemInfo } from '@types';
// import { Link } from 'react-router-dom';
// import uuid from 'react-uuid';
//
// type ProblemProps = {
//   problem: ProblemInfo;
//   check: boolean;
// };
//
// const ProblemWrapper = styled.div`
//   width: 100%;
//   height: 7.5rem;
//   border: 3px solid #cbcbcb;
//   border-radius: 8px;
//   background: #fff;
//   position: relative;
//   min-width: 40rem;
//
//   &:hover {
//     background: #e6f3ea;
//     border: none;
//     box-shadow: 3px 3px 3px 3px #b9b9b9;
//   }
// `;
//
// const Title = styled.div`
//   position: absolute;
//   top: 1rem;
//   left: 3rem;
//   font-style: normal;
//   font-weight: 500;
//   font-size: 2rem;
// `;
//
// const Description = styled.div`
//   position: absolute;
//   bottom: 0.8rem;
//   left: 3rem;
//   font-style: normal;
//   font-weight: 500;
//   font-size: 1.2rem;
//   text-align: center;
// `;
//
// const ButtonWrapper = styled.div`
//   position: absolute;
//   bottom: 0.9rem;
//   right: 0.9rem;
//   display: flex;
//   gap: 1.5rem;
// `;
//
// const Button = styled.button`
//   outline: none;
//   width: 8rem;
//   height: 2.6rem;
//   border: 2px solid #32c766;
//   border-radius: 8px;
//   background: #fff;
//   font-weight: 500;
//   font-size: 1.3rem;
//   line-height: 1.5rem;
//   text-align: center;
//   box-shadow: 0.5px 0.5px 0.5px 0.5px #75efa2;
//   position: relative;
//   &:hover {
//     background: #aad4b6;
//     color: white;
//     font-weight: bold;
//     box-shadow: 2px 2px 2px 2px #b9b9b9;
//     border: none;
//   }
// `;
//
// const getRoomNumber = (id: number) => {
//   let room = localStorage.getItem(`problem${id}`);
//   if (!room) {
//     room = btoa(uuid());
//     localStorage.setItem(`problem${id}`, room);
//   }
//   return room;
// };
//
// const Mark = styled.div`
//   position: absolute;
//   left: 0rem;
//   top: -2.2rem;
//   text-align: center;
//   font-size: 3rem;
//   color: #e69c9f;
//   font-weight: bold;
//   z-index: 2;
// `;
//
// const Problem = ({ problem, check }: ProblemProps) => {
//   const { problemId, title, level, isSolved } = problem;
//   const singleURL = `/problem/single/${problemId}`;
//   let multiURL = `/problem/multi/${problemId}/`;
//   if (problemId != null) {
//     multiURL = `/problem/multi/${problemId}/${getRoomNumber(problemId)}`;
//   }
//
//   return (
//     <ProblemWrapper>
//       {check && isSolved && <Mark>✓</Mark>}
//       <Title>{title}</Title>
//       <Description>Lv{level}, Python, Javascript</Description>
//       <ButtonWrapper>
//         <Link to={singleURL}>
//           <Button>혼자 풀기</Button>
//         </Link>
//         <Link to={multiURL}>
//           <Button>같이 풀기</Button>
//         </Link>
//       </ButtonWrapper>
//     </ProblemWrapper>
//   );
// };
//
// export default memo(Problem);
// 함께풀기 기능만 남긴 페이지



import React, { memo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import uuid from 'react-uuid';

type ProblemProps = {
    problemId: number; // 예시를 위해 problemId를 직접 props로 받는 것으로 변경
};

const Container = styled.div`
    display: flex;
    flex-direction: column; // 버튼을 수직으로 배열
    align-items: center; // 가로 중앙 정렬
    justify-content: center; // 세로 중앙 정렬
    height: 100vh; // 전체 뷰포트 높이
    padding: 20px;
    background: #f0f0f0;
`;

const StyledButton = styled.button`
    width: 95%;
    height: 150px;
    margin: 20px;
    border: none;
    border-radius: 10px;
    background-color: #000000; // 기본 배경색을 검은색으로 설정
    color: white; // 기본 글자 색상을 흰색으로 설정
    font-size: 1.8rem;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    z-index: 1;

    &:hover {
        background-color: #333333; // 호버 상태에서의 배경색 변경
        color: #FFD700; // 호버 상태에서의 글자 색상을 황금색으로 변경
        font-weight: bold;
        text-shadow: 0 0 8px #FFFFFF; // 텍스트에 흰색 그림자 추가
    }
    
`;

const getRoomNumber = (id: number) => {
    let room = localStorage.getItem(`problem${id}`);
    if (!room) {
        room = btoa(uuid());
        localStorage.setItem(`problem${id}`, room);
    }
    return room;
};

const Problem = ({ problemId }: ProblemProps) => {
    const multiURL1 = `/problem/multi/${problemId}/${getRoomNumber(problemId + 1)}`;
    const multiURL2 = `/problem/multi/${problemId}/${getRoomNumber(problemId + 2)}`;

    return (
        <Container>
            <Link to={multiURL1} style={{ textDecoration: 'none', width: '100%' }}>
                <StyledButton>방 1 참가하기</StyledButton>
            </Link>
            <Link to={multiURL2} style={{ textDecoration: 'none', width: '100%' }}>
                <StyledButton>방 2 참가하기</StyledButton>
            </Link>
        </Container>
    );
};

export default memo(Problem);
