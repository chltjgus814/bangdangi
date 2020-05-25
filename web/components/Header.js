import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';

export default function Header({isTranslucent = false}) {
  const {replace, push, pathname} = useRouter();
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('token');
      const type = window.localStorage.getItem('type') || null;
      setLoggedIn(token !== 'undefined' && token !== null);
      setUserType(type);
    }
  }, [pathname]);

  const onLogout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('type');
    if (userType === 'host') {
      replace('/host/main');
    } else {
      replace('/');
    }
    setUserType(null);
    setLoggedIn(false);
  };

  const goHome = () => {
    console.log(userType);
    if (userType === 'host') {
      push('/host');
    } else {
      push('/');
    }
  };

  return (
    <div className={`w-screen h-16 z-50 flex px-6 flex-row items-center justify-between ${isTranslucent ? 'bg-transparent absolute top-0' : 'bg-white shadow-xs'}`}>
      <a className="" onClick={() => goHome()}>
        <img className="w-20" src="/logo_main.png" alt="Logo" />
      </a>

      <div className="flex flex-row items-center">
        <a className="font-bold text-sm text-gray-800" onClick={() => push('/host/register')}>
          방 등록하기
        </a>

        {isLoggedIn ? (
          <a className="ml-6 font-bold text-sm text-gray-800" onClick={() => onLogout()}>로그아웃</a>
        ) : null}
      </div>
    </div>
  );
};
