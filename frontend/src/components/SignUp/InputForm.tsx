import { useEffect, useRef, useState } from 'react';
import {
  AnchorLogo,
  ButtonContainer,
  CheckButton,
  GreenMark,
  IDInputContainer,
  InputFormContainer,
  LightContainer,
  PasswordInputContainer,
} from '../../styles/SignUp.style';
import useInput from '../../hooks/useInput';
import { useNavigate } from 'react-router-dom';

const URL = import.meta.env.VITE_SERVER_URL;

export const SignupInputForm = () => {
  const id = useInput('');
  const pw = useInput('');
  const pwCheck = useInput('');
  const [isIdRight, setIdRight] = useState(false);
  const [isPwRight, setPwRight] = useState(false);
  const [idCheck, setIdCheck] = useState(false);
  const [checkedId, setCheckedId] = useState('');
  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const pwCheckRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { value } = id;
    if (idValid(value) && idCheck && checkedId === id.value) {
      setIdRight(true);
    } else setIdRight(false);
  }, [id]);

  useEffect(() => {
    const { value } = pw;
    if (pwValid(value)) setPwRight(true);
  }, [pw]);

  useEffect(() => {
    const { value } = pwCheck;
    if (!pwValid(value) || value === '' || value !== pw.value)
      setPwRight(false);
    else setPwRight(true);
  });

  const idValid = (str: string) => {
    return /\w{6,20}/g.test(str);
  };

  const pwValid = (str: string) => {
    // eslint-disable-next-line no-useless-escape
    return /[\w\[\]\/?.,;:|*~`!^\-_+<>@$%&\\]{8,}/g.test(str);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLElement>,
    ref: React.RefObject<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter' && ref.current) {
      e.preventDefault();
      ref.current.focus();
    }
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    id.onReset();
    pw.onReset();
    pwCheck.onReset();
    setIdRight(false);
    setPwRight(false);
    setIdCheck(false);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isIdRight || !idCheck) alert('아이디를 확인해해주세요');
    else if (!isPwRight) alert('비밀번호를 다시 입력해주세요');
    else {
      //useFetch
      fetch(`${URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: id.value,
          password: pw.value,
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.statusCode === 400) throw new Error();
          alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
          navigate('/signin');
        })
        .catch(() => {
          alert('회원가입에 실패하였습니다');
          navigate('');
        });
    }
  };
  const handleIdCheck = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!idValid(id.value)) alert('올바른 아이디를 입력해주세요');
    else {
      fetch(`${URL}/users?loginId=${id.value}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.foundStatus === 1000) {
            throw new Error();
          } else if (res.foundStatus === 1001) {
            alert('아이디를 사용하실 수 있습니다');
            setIdCheck(true);
            setCheckedId(id.value);
            if (pwRef.current) pwRef.current.focus();
          }
        })
        .catch((err) => {
          alert('아이디를 사용하실 수 없습니다');
          setIdCheck(false);
          setIdRight(false);
        });
    }
  };



  return (
      <div
          className="flex flex-col items-center justify-center w-full max-w-4xl px-8 py-10 bg-white shadow-lg rounded-xl">

        <form className="w-full mt-8 space-y-6">
          <div className="space-y-1">
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">ID</label>
            <input
                type="text"
                placeholder="6자 이상"
                {...id}
                ref={idRef}
                onKeyPress={(e) => handleKeyPress(e, pwRef)}
                className="input input-bordered w-full max-w-lg"
            />
            <div className="mt-1">
              {isIdRight ? (
                  <span className="text-green-500">ID available</span>
              ) : (
                  <span className="text-red-500">ID not available</span>
              )}
            </div>
            <button
                type="button"
                className="btn btn-primary mt-2"
                onClick={handleIdCheck}
            >
              Check Availability
            </button>
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
                type="password"
                placeholder="특수문자 포함 8자 이상"
                {...pw}
                ref={pwRef}
                onKeyPress={(e) => handleKeyPress(e, pwCheckRef)}
                className="input input-bordered w-full max-w-lg"
            />
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm
              Password</label>
            <input
                type="password"
                placeholder="Repeat your password"
                {...pwCheck}
                ref={pwCheckRef}
                className="input input-bordered w-full max-w-lg"
            />
            <div className="mt-1">
              {isPwRight ? (
                  <span className="text-green-500">Passwords match</span>
              ) : (
                  <span className="text-red-500">Passwords do not match</span>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <button
                type="reset"
                className="btn btn-secondary"
                onClick={handleClear}
            >
              Clear
            </button>
            <button
                type="submit"
                className="btn btn-success"
                onClick={handleSubmit}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
  );
};
