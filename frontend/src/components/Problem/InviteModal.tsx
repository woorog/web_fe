// import styled from 'styled-components';
// import { ReactComponent as Copy } from '../../assets/copy-icon.svg';
// import { useCallback, useRef } from 'react';
// import { ReactComponent as Refresh } from '../../assets/icons/Refresh_icon.svg';
// import { useNavigate, useParams } from 'react-router-dom';
// import uuid from 'react-uuid';

// interface props {
//   isShowing: boolean;
// }

// const Wrapper = styled.div`
//   position: absolute;
//   left: 4rem;
//   transform: translateY(-100%);
//   background-color: rgb(255, 255, 255);
//   width: 55rem;
//   height: 6rem;
//   z-index: 99;
//   border: 1px solid;
//   border-radius: 8px;
//   box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);

//   p {
//     margin: 0.5rem 1rem;
//     font-weight: 600;
//     font-family: Noto Sans KR, sans-serif;
//     font-size: 1rem;
//   }
// `;

// const URLWrapper = styled.div`
//   width: 55rem;
//   margin-left: 1rem;
//   height: calc(100% - 37px);
//   display: flex;
//   justify-content: left;
//   align-items: center;
// `;

// const URLContainer = styled.div`
//   width: 90%;
//   height: 75%;
//   border: 0;
//   border-radius: 16px;
//   outline: none;
//   padding-left: 10px;
//   background-color: rgb(233, 233, 233);
//   display: flex;
//   align-items: center;
//   font-weight: 500;
//   -webkit-user-select: text;
//   -moz-user-select: text;
//   -ms-user-select: text;
//   user-select: text;
// `;

// const ButtonWrapper = styled.button`
//   margin-left: 0.3rem;
//   width: 3%;
//   height: 50%;
//   cursor: pointer;
//   background: #ffffff;
//   border: 2px solid #33c363;
//   box-shadow: 0 8px 24px rgb(51 195 99 / 50%);
//   border-radius: 4px;
//   padding: 0;

//   :active {
//     background: #dbf6e4;
//     box-shadow: 0 5px #666;
//     transform: translateY(4px);
//   }

//   :hover {
//     background: #dbf6e4;
//   }
// `;

// export const InviteModal = ({ isShowing }: props) => {
//   const url = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const handleCopy = useCallback(() => {
//     navigator.clipboard.writeText(url.current!.innerText);
//   }, [url.current]);

//   const handleChange = useCallback(() => {
//     const newPath = btoa(uuid());
//     localStorage.setItem(`problem${id}`, newPath);
//     navigate(`/problem/multi/${id}/${newPath}`);
//     navigate(0);
//   }, []);

//   return isShowing ? (
//     <Wrapper>
//       <p>초대 URL</p>
//       <URLWrapper>
//         <URLContainer ref={url}>{`${window.location.href}`}</URLContainer>
//         <ButtonWrapper onClick={handleCopy}>
//           <Copy width={'1rem'} />
//         </ButtonWrapper>
//         <ButtonWrapper onClick={handleChange}>
//           <Refresh />
//         </ButtonWrapper>
//       </URLWrapper>
//     </Wrapper>
//   ) : null;
// };

import React, { useCallback, useRef } from 'react';
import { ReactComponent as Copy } from '../../assets/copy-icon.svg';
import { ReactComponent as Refresh } from '../../assets/icons/Refresh_icon.svg';
import { useNavigate, useParams } from 'react-router-dom';
import uuid from 'react-uuid';

interface Props {
  isShowing: boolean;
  setIsShowing: (isShowing: boolean) => void;
}

export const InviteModal = ({ isShowing, setIsShowing }: Props) => {
  const url = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleCopy = useCallback(() => {
    if (url.current) {
      console.log("Copying URL:", url.current.innerText); // 디버깅용 콘솔 로그
      navigator.clipboard.writeText(url.current.innerText)
        .then(() => {
          console.log("URL copied successfully!");
          setIsShowing(false); // URL 복사 후 모달 닫기
        })
        .catch((error) => {
          console.error("Failed to copy URL:", error);
        });
    }
  }, [setIsShowing]);

  const handleChange = useCallback(() => {
    const newPath = btoa(uuid());
    localStorage.setItem(`problem${id}`, newPath);
    navigate(`/problem/multi/${id}/${newPath}`);
    navigate(0);
  }, [id, navigate]);

  return isShowing ? (
    <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-11 bg-white w-220 h-24 z-50 border border-gray-300 rounded-lg shadow-md p-4 flex flex-col justify-between">
      <div className="flex items-center -translate-y-4">
        <div
          ref={url}
          className="flex-grow h-10 rounded-lg pl-2 flex items-center font-medium select-text"
        >
          {`${window.location.href}`}
        </div>
        <button
          onClick={handleCopy}
          className="ml-2 w-10 h-10 flex items-center justify-center cursor-pointer bg-white border-2 border-green-500 shadow-lg rounded-md active:bg-green-100 active:shadow-sm active:transform active:translate-y-1 hover:bg-green-100"
        >
          <Copy width="1rem" />
        </button>
        <button
          onClick={handleChange}
          className="ml-2 w-10 h-10 flex items-center justify-center cursor-pointer bg-white border-2 border-green-500 shadow-lg rounded-md active:bg-green-100 active:shadow-sm active:transform active:translate-y-1 hover:bg-green-100"
        >
          <Refresh />
        </button>
      </div>
    </div>
  ) : null;
};