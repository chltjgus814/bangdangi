import {useState, useEffect} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import YouTube from 'react-youtube';
import Slider from "react-slick";
import {Header, Card, RoomAdvertise} from 'components';
import axios from 'utils/axios';


export default function Home() {
  const {push} = useRouter();

  const [rooms, setRoom] = useState([]);
  const [youtubes, setYoutube] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/home/');
        const {data} = res;
        const {rooms, youtubes} = data;
        if (Array.isArray(rooms)) {
          setRoom(rooms);
        }
        if (Array.isArray(youtubes)) {
          setYoutube(youtubes);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetch();
  }, []);

  return (
    <div>
      <Head>
        <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </Head>

      <div
        className="z-0 py-6 h-screen bg-center bg-cover bg-no-repeat bg-fixed items-center justify-center flex flex-col h-full"
        style={{backgroundImage: "url('/main.png')"}}
      >
        <Header isTranslucent isHost={false} />
        <div className="opacity-25 bg-black w-full h-full z-10 absolute top-0"></div>
        <div className="z-20 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-white text-center z-20 my-4 mb-64">단기방을 한 번에 찾고<br/>원하는 기간만큼 계약하세요.</h1>
          <button
            onClick={() => push('/rooms')}
            className="text-lg font-bold py-2 px-8 rounded-full text-white z-20 hover:border-transparent border border-white hover:bg-white hover:text-black">
            방 보러가기
          </button>
        </div>
      </div>

      {rooms.length > 0 ? (
        <div className="p-4">
          <p className="font-bold text-lg mb-4">새로 등록된 방</p>
          <div>
            {rooms.map((d, i) => <Card key={i} data={d} />)}
          </div>
        </div>
      ) : null}

      <RoomAdvertise />

      {youtubes.length > 0 ? (
        <div>
          <div className="max-w-screen-md px-4 py-6">
            <Slider {...{
              dots: false,
              infinite: true,
              arrows: false,
              speed: 500,
              slidesToShow: 1,
              slidesToScroll: 1
            }}>
              {youtubes.map((d, i) => (
                <YouTube videoId={d.video_id} containerClassName={"youtubeContainer"} />
              ))}
            </Slider>
          </div>
        </div>
      ) : null}
    </div>
  );
}
