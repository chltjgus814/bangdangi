import {useRouter} from 'next/router';
import {useEffect} from 'react';
import axios from 'utils/axios';

export default function Login({host}) {
  const {query, push} = useRouter();

  useEffect(() => {
    if (!Kakao.isInitialized()) {
      Kakao.init('503e7b0bc7bb69792c7d8fed461f4e26');
    }

    return () => Kakao.cleanup();
  }, []);

  useEffect(() => {
    const kakaoLogin = async (code) => {
      try {
        const res = await axios.post('/users/login/kakao/', {
          url: `${host}/users/login?from=kakao`,
          code,
          type: 'user'
        });
        const {data} = res;
        const {token, has_phone, type: userType} = data;

        window.localStorage.setItem('token', token);
        window.localStorage.setItem('type', userType) || 'user';

        if (userType === 'host' && !has_phone) {
          push('/users/host/phone');
        } else if (userType === 'host') {
          push('/host')
        } else {
          push('/');
        }
      } catch (error) {
        console.log(error);
      }
    };

    const {from} = query;
    if (from && from === 'kakao') {
      const {code} = query;

      if (code && code.length > 0) {
        kakaoLogin(code);
      }
    }
  }, [query]);

  const onGoogleLoin = () => {

  };

  const onKakaoLoin = () => {
    Kakao.Auth.authorize({
      redirectUri: `${host}/users/login?from=kakao`
    });
  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="w-full px-12 flex justify-center items-center flex-col h-screen">
        <img className="-mt-10 mb-4 w-40" src="/logo.png" />
        <h3 className="mb-2 text-xl text-gray-900 leading-tight font-bold">간편가입 / 로그인</h3>
        <p className="mb-12 text-sm font-light text-gray-600">방단기를 통해 단기 원룸을 경험해 보세요</p>

        <button 
          className="w-full max-w-sm h-12 bg-white-400 px-6 justify-center items-center flex flex-row rounded-lg shadow mb-4 border-solid border" 
          onClick={() => onGoogleLoin()}>
          <img className="w-6 mr-2" src="/google.png" />
          <span className="text-sm font-semibold">구글 계정으로 계속하기</span>
        </button>

        <button 
          className="w-full max-w-sm h-12 bg-yellow-400 px-6 justify-center items-center flex flex-row rounded-lg shadow" 
          onClick={() => onKakaoLoin()}>
          <img className="w-24 -ml-6" src="/kakao.png" />
          <span className="-ml-6 text-sm font-semibold">카카오 계정으로 계속하기</span>
        </button>
      </div>
    </div>
  );
}
