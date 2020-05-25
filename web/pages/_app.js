
import {useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import {Footer} from 'components';
import "styles/index.css";
import axios from 'utils/axios';


const isDev = process.env.NODE_ENV === 'development';
const host = isDev ? 'http://localhost:3000' : 'https://bangdangi.com';

export default function Bangdangi({Component, pageProps}) {
  const {replace, pathname} = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('token');

      if (pathname.match('\/(host.+)') && !token) {
        replace('/users/host/login');
      } else if (token && token.length > 0) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  }, [pathname]);

  return (
    <>
      <Head>
        <title>방단기</title>
        <script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>
      </Head>
      <Component {...pageProps} host={host} />
      <Footer />
    </>
  );
}
