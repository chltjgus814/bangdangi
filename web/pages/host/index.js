import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Header, Card} from 'components';
import axios from 'utils/axios';

export default function Host() {
  const [rooms, setRoom] = useState([]);
  const {push} = useRouter();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/rooms/');
        const {data} = res;
        setRoom(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetch();
  }, []);

  const onUpdate = () => {
    push('/host');
  };

  const onDelete = async (roomId) => {
    try {
      const res = await axios.delete(`/rooms/${roomId}`);
      const {status} = res;
      if (status === 204) {
        const newRooms = rooms.filter(r => r.id !== roomId);
        setRoom(newRooms);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header />

      <div className="w-full bg-white ">
        {rooms.length === 0 ? (
          <div className="h-64 text-center flex items-center justify-center">
              아직 등록된 매물이 없습니다.
          </div>
        ) : null}

        {rooms.map((r, i) => (
          <div key={i} className="mb-4">
            <Card data={r} />

            <div className="flex flex-row items-center justify-center w-full">
              <button
                className="text-white bg-blue-400 flex items-cener justify-center rounded-lg text-center px-10 py-2 font-bold text-lg mr-2"
                onClick={() => onUpdate(r.id)}>수정하기</button>
              <button
                className="text-white bg-red-400 flex items-cener justify-center rounded-lg text-center px-10 py-2 font-bold text-lg"
                onClick={() => onDelete(r.id)}>삭제하기</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
