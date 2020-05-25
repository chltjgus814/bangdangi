import {useRouter} from 'next/router';

export default function RoomAdvertise() {
  const {push} = useRouter();

  return (
    <div className="flex flex-col items-center justify-center bg-black opacity-25 px-8 py-12">
      <p className="text-xl text-white text-center mb-4">수수료 없이 직접 방을 홍보하세요</p>
      <p className="text-base text-white text-center mb-8">
        남는 방을 빌려주고 임대수익을 만드세요<br/>
        원하는 기간만큼 빌려주시면 됩니다.
      </p>

      <button
        onClick={() => push('/host/register')}
        className="text-lg font-bold py-2 px-8 rounded-full text-white z-20 hover:border-transparent border border-white hover:bg-white hover:text-black">
        방 등록하기
      </button>
    </div>
  );
};
