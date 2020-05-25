import {useState, useEffect} from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {Card, RoomAdvertise, Header} from 'components';
import axios from 'utils/axios';

const animatedComponents = makeAnimated();

export default function RoomList() {
  const [rooms, setRoom] = useState([]);
  const [sort, setSort] = useState('-created');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/rooms/?sort=${sort}`);
        const {data} = res;
      } catch (err) {
        console.log(err);
      }
    };

    fetch();
  }, [sort]);

  return (
    <div>
      <Header />

      <div className="py-2 px-4">
        <Select
          placeholder="지역을 선택해 주세요"
          closeMenuOnSelect={false}
          components={animatedComponents}
          defaultValue={[]}
          isMulti
          options={[]}
        />
      </div>

      <div className="">

      </div>

      {rooms.map((d, i) => <Card key={i} data={d} />)}
    </div>
  );
};
