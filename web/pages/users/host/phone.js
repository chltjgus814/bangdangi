import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import axios from '../../../utils/axios';

export default function Phone() {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const {push} = useRouter();

  const onVerify = async () => {
    try {
      const res = await axios.post('/users/phone/', {phone});
      if (res.status === 200) {
        setStep(1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onCode = async () => {
    try {
      const res = await axios.post('/users/phone/verify/', {phone, code});
      if (res.status === 200) {
        push('/');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="w-full px-12 flex justify-center items-center flex-col h-screen">
        <img className="-mt-10 mb-4 w-40" src="/logo.png" />
        <h3 className="mb-2 text-xl text-gray-900 leading-tight font-bold">휴대전화 인증</h3>
        <p className="mb-12 text-sm font-light text-gray-600">방단기를 통해 단기 원룸을 경험해 보세요</p>

        {step === 0 ? (
          <>
            <input
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              placeholder="01012341234"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button 
              className="mt-4 w-full max-w-sm h-12 bg-gray-400 px-6 justify-center items-center flex flex-row rounded-lg shadow"
              onClick={() => onVerify()}>
              <span className="text-sm font-semibold">인증하기</span>
            </button>
          </>
        ) : (
          <>
            <input
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              placeholder="인증번호 4자리를 입력해주세요"
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <button 
              className="mt-4 w-full max-w-sm h-12 bg-gray-400 px-6 justify-center items-center flex flex-row rounded-lg shadow"
              onClick={() => onCode()}>
              <span className="text-sm font-semibold">인증하기</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}