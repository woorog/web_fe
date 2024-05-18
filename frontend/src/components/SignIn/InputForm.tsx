import React, { useCallback, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserState } from '../../hooks/useUserState';
import { Link } from 'react-router-dom';

export const SigninInputForm = () => {
  const [isLoading, setLoading] = useState(false);
  const id = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const requestURL = useMemo(
    () => import.meta.env.VITE_SERVER_URL + '/auth/signin',
    [],
  );
  const navigate = useNavigate();
  const { loginHandler } = useUserState();
  const { version } = useParams();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      fetch(requestURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: id.current?.value,
          password: password.current?.value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.msg === 'success') {
            const expirationTime = new Date(
              new Date().getTime() + data.effectiveTime,
            ).toISOString();
            loginHandler(data.accessToken, expirationTime, data.userId);
            !version && navigate(-1);
            return;
          }
          alert('로그인에 실패하였습니다.');
        })
        .catch(() => {
          setLoading(false);
          alert('로그인에 실패하였습니다.');
        });
    },
    [id, password, requestURL],
  );

  return (
    <>
      <div className="p-4 text-xl font-bold"></div>
      <form onSubmit={handleSubmit} className="space-y-4 text-xl font-bold">
        <div className="flex flex-col">
          <label htmlFor={'id'} className="text-black">
            아이디
          </label>
          <input
            type={'text'}
            ref={id}
            id={'id'}
            className="mt-1 p-2 border rounded text-black"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor={'password'} className="text-black">
            비밀번호
          </label>
          <input
            type={'password'}
            ref={password}
            id={'password'}
            className="mt-1 p-2 border rounded text-black"
          />
        </div>
        {isLoading ? (
          <span className="text-black">sending...</span>
        ) : (
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type={'submit'}
              className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-700 shadow-lg transition duration-300"
            >
              로그인
            </button>
            <Link
              to={'/signup'}
              className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-700 shadow-lg transition duration-300"
            >
              회원가입
            </Link>
          </div>
        )}
      </form>
    </>
  );
};
