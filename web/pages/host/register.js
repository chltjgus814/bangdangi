import {useRouter} from 'next/router';
import {useRef, useState, useEffect} from 'react';
import DaumPostcode from 'react-daum-postcode';
import DatePicker from 'react-mobile-datepicker';
import AsyncCreatableSelect from 'react-select/async-creatable';
import {FaCamera} from "react-icons/fa";
import moment from 'moment';
import {Header, ImageCard} from 'components';
import axios from 'utils/axios';

moment.locale('ko');

export default function Register() {
  const {push} = useRouter();
  
  const imageInput = useRef(null);
  const address2Input = useRef(null);

  const [images, setImage] = useState([]);
  const [imageData, setImageData] = useState([]);
  
  const [isOpenKakao, setOpenKakao] = useState(false);
  const [isOpenDate, setOpenDate] = useState(false);
  const [fullAddress, setFullAddress] = useState('');
  const [currentDate, setCurrent] = useState(null);

  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [buildingNumber, setBuildingCode] = useState('');
  const [deposit, setDeposit] = useState(0);
  const [rent, setRent] = useState(0);
  const [expense, setExpense] = useState(0);

  const [contractType, setContracType] = useState(0);
  const [contractStart, setContractStart] = useState('');
  const [contractEnd, setContractEnd] = useState('');
  const [contractPeriod, setContractPeriod] = useState(1);
  const [moveDate, setMoveDate] = useState('');

  const [description, setDescription] = useState('');
  const [keywords, setKeyword] = useState([]);

  const loadImage = (e) => {
    if (window.File && window.FileReader && window.FormData) {
      const image = e.target.files[0];

      if (image) {
        if (/^image\//i.test(image.type)) {
          readImage(image);
        } else {
          console.log('Can`t read image')
        }
      }
    }
  };

  const readImage = (image) => {
    const reader = new FileReader();

    reader.onloadend = function() {
      processImage(reader.result, image.type);
    };

    reader.onerror = function() {
      console.log('There was an error reading the file!');
    };

    reader.readAsDataURL(image);
  };

  const processImage = (dataURL, fileType) => {
    const maxWidth = 800;
    const maxHeight = 800;
    
    const image = new Image();
    image.src = dataURL;

    image.onload = function() {
      const width = image.width;
      const height = image.height;
      const shouldResize = (width > maxWidth) || (height > maxHeight);

      if (!shouldResize) {
        const newImages = [...images, {url: dataURL}];
        setImage(newImages);
        sendImage(dataURL);
        return;
      }

      let newWidth, newHeight;
      if (width > height) {
        newHeight = height * (maxWidth / width);
        newWidth = maxWidth;
      } else {
        newWidth = width * (maxHeight / height);
        newHeight = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const context = canvas.getContext('2d');
      context.drawImage(this, 0, 0, newWidth, newHeight);
      dataURL = canvas.toDataURL(fileType);

      const newImages = [...images, {url: dataURL}];
      setImage(newImages);
      sendImage(dataURL);
    };

    image.onerror = function() {
      console.log('There was an error processing your file');
    };
  };

  const sendImage = async (fileData) => {
    const formData = new FormData();
    formData.append('image', fileData);

    try {
      const res = await axios.post('/rooms/image/', formData, {timeout: 10000});
      const {data, status} = res;
      if (status === 201) {
        const {id} = data;
        const newImageData = [...imageData, id];
        setImageData(newImageData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = (index) => {
    const newImages = [...images].filter((_, i) => i !== index);
    setImage(newImages);
  };

  const onCompleteAddress = (data) => {
    const {
      roadAddress,
      buildingName,
      buildingCode,
      zonecode,
    } = data;

    setAddress(roadAddress);
    setZipCode(zonecode);
    setBuildingName(buildingName);
    setBuildingCode(buildingCode);

    setOpenKakao(false);

    address2Input.current.focus();
  };

  const onChange = (e, type) => {
    const value = e.target.value;
    e.preventDefault();

    if (type === 'address2') {
      setAddress2(value);
    } else if (type === 'deposit') {
      setDeposit(value);
    } else if (type === 'rent') {
      setRent(value);
    } else if (type === 'expense') {
      setExpense(value);
    } else if (type === 'contractPeriod') {
      setContractPeriod(value);
    } else if (type === 'contractStart') {
      setContractStart(value);
    } else if (type === 'contractEnd') {
      setContractEnd(value);
    } else if (type === 'moveDate') {
      setMoveDate(value);
    } else if (type === 'description') {
      setDescription(value);
    }
  };

  const onChangeContractType = (type) => {
    setContracType(type);
  };
  
  const onSelectDate = (data) => {
    const value = moment(data).format("YYYY-MM-DD");
    
    if (currentDate === 'moveDate') {
      setMoveDate(value);
    } else if (currentDate === 'contractStart') {
      setContractStart(value);
    } else if (currentDate === 'contractEnd') {
      setContractEnd(value);
    }

    setCurrent(null);
    setOpenDate(false);
  };

  const onOpenDatePicker = (type) => {
    setOpenDate(true);
    setCurrent(type);
  };

  const promiseOptions = async inputValue => {
    try {
      const res = await axios.get(`/rooms/keyword/?value=${inputValue}`);
      const {data} = res;
      return data.map(d => ({label: d.name, value: d.id}));
    } catch (err) {
      return [];
    }
  };

  const onChangeKeyword = (value) => {
    setKeyword(value);
  };

  const onSubmit = async () => {
    let data = {
      images: imageData,
      keywords,
      address,
      address2,
      'zip_code': zipCode,
      deposit,
      rent,
      expense,
      contract_type: contractType,
      description,
    }

    if (contractType === 0) {
      data = Object.assign({}, data, {
        contract_period: contractPeriod,
        move_date: moveDate,
      });
    } else {
      data = Object.assign({}, data, {
        contract_start: contractStart,
        contract_end: contractEnd,
      });
    }

    try {
      const res = await axios.post('/rooms/', data);
      const {status} = res;
      
      if (status === 201) {
        push('/host');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header />

      <div className="py-4 flex flex-col items-center">
        <div className="px-4 w-full flex flex-row items-center flex-wrap">
          <div
            className="w-24 h-24 rounded-lg bg-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-300 focus:bg-gra-300 mb-4 mr-4"
            onClick={() => imageInput.current.click()}
          >
            <FaCamera size="2.5rem" color="white" />
            <input
              className="hidden"
              type="file"
              accept="image/*"
              ref={imageInput}
              onChange={(e) => loadImage(e)}
            />
          </div>

          {images.map((d, i) => (
            <ImageCard
              key={i}
              isFirst={i === 0}
              url={d.url}
              onDelete={() => onDelete(i)}
            />
          ))}
        </div>

        <div className="bg-white py-2 mb-4 px-4 w-full flex flex-col items-center py-4">
          <input
            onClick={() => setOpenKakao(true)}
            className="text-gray-800 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal mb-2"
            type="text"
            placeholder="주소 찾기"
            value={address}
            readOnly
          />

          <input
            className="text-gray-800 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            type="text"
            placeholder="상세주소"
            ref={address2Input}
            value={address2}
            
            onChange={e => onChange(e, 'address2')}
          />

          <span className="text-red-500 font-bold text-xs text-center mt-2">상세주소는 사이트에 노출되지 않습니다.</span>
        </div>

        <div className="py-4 px-4 w-full bg-white">
          <div className="relative mb-4">
            <p className="font-bold text-sm mb-2 text-gray-800">보증금</p>
            <input
              className="text-gray-800 text-right pr-10 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              type="number"
              value={deposit}
              min={0}
              onChange={e => onChange(e, 'deposit')}
            />
            <span className="text-sm font-bold absolute text-gray-700" style={{right: '0.6rem', bottom: '0.6rem'}}>만원</span>
          </div>

          <div className="relative mb-4">
            <p className="font-bold text-sm mb-2 text-gray-800">월세</p>
            <input
              className="text-gray-800 text-right pr-10 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              type="number"
              value={rent}
              min={0}
              onChange={e => onChange(e, 'rent')}
            />
            <span className="text-sm font-bold absolute text-gray-700" style={{right: '0.6rem', bottom: '0.6rem'}}>만원</span>
          </div>

          <div className="relative">
            <p className="font-bold text-sm mb-2 text-gray-800">관리비</p>
            <input
              className="text-gray-800 text-right pr-10 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              type="number"
              value={expense}
              min={0}
              onChange={e => onChange(e, 'expense')}
            />
            <span className="text-sm font-bold absolute text-gray-700" style={{right: '0.6rem', bottom: '0.6rem'}}>만원</span>
          </div>
        </div>

        <div className="w-full mt-6 mb-6">
          <div className="flex flex-row items-center h-12">
            <div
              className={`flex-1 flex h-full items-center justify-center ${contractType === 0 ? 'bg-blue-400' : 'bg-gray-400'}`}
              onClick={() => onChangeContractType(0)}
            >
              <span className="text-white font-bold text-base">최소 계약기간</span>
            </div>
            <div
              className={`flex-1 flex h-full items-center justify-center ${contractType === 1 ? 'bg-blue-400' : 'bg-gray-400'}`}
              onClick={() => onChangeContractType(1)}
            >
              <span className="text-white font-bold text-base">고정 계약기간</span>
            </div>
          </div>

          <div className="py-4 px-4 bg-white w-full mb-6">
            {contractType === 0 ? (
              <div className="flex flex-col items-center w-full">
                <div className="relative mb-4 w-full">
                  <p className="font-bold text-sm mb-2 text-gray-800">최소</p>
                  <input
                    className="text-gray-800 text-right pr-16 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                    type="number"
                    value={contractPeriod}
                    onChange={e => onChange(e, 'contractPeriod')}
                  />
                  <span className="text-sm font-bold absolute text-gray-700" style={{right: '0.6rem', bottom: '0.6rem'}}>달 이상</span>
                </div>

                <div className="relative w-full">
                  <p className="font-bold text-sm mb-2 text-gray-800">입주 가능 날짜</p>
                  <input
                    className="text-gray-800 text-right bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                    type="text"
                    readOnly
                    placeholder="0000-00-00"
                    onClick={() => onOpenDatePicker('moveDate')}
                    value={moveDate}
                    onChange={e => onChange(e, 'moveDate')}
                  />
                </div>

                <span className="text-red-500 font-bold text-xs text-center mt-2">오늘 날짜를 입력하면 '즉시가능’ 으로 등록 됩니다.</span>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="relative w-full mb-4">
                  <p className="font-bold text-sm mb-2 text-gray-800">계약 시작일</p>
                  <input
                    className="text-gray-800 text-right bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                    type="text"
                    readOnly
                    placeholder="0000-00-00"
                    onClick={() => onOpenDatePicker('contractStart')}
                    value={contractStart}
                    onChange={e => onChange(e, 'contractStart')}
                  />
                </div>

                <div className="relative w-full">
                  <p className="font-bold text-sm mb-2 text-gray-800">계약 종료일</p>
                  <input
                    className="text-gray-800 text-right bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                    type="text"
                    readOnly
                    placeholder="0000-00-00"
                    onClick={() => onOpenDatePicker('contractEnd')}
                    value={contractEnd}
                    onChange={e => onChange(e, 'contractEnd')}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="py-6 px-4 bg-white w-full">
            <textarea
              className="mb-6 resize-none h-56 text-gray-800 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              placeholder="방에 대한 상세 설명을 작성해 주세요."
              value={description}
              onChange={e => onChange(e, 'description')}
            ></textarea>

            <div className="relative w-full">
              <AsyncCreatableSelect
                instanceId="room-keyword"
                placeholder="#태그 입력"
                value={keywords}
                onChange={onChangeKeyword}
                cacheOptions
                isMulti
                loadOptions={promiseOptions}
              />
            </div>
          </div>
        </div>

        {isOpenKakao ? (
          <DaumPostcode
            onComplete={onCompleteAddress}
            autoClose
            autoResize
            animation
          />
         ) : null}

        <button
          className="text-white bg-blue-400 flex items-cener justify-center rounded-lg text-center px-12 py-3 font-bold text-lg my-6"
          onClick={() => onSubmit()}
        >
          방 등록하기
        </button>
        
        {isOpenDate ? (
          <div className="fixed bottom-0 w-full h-full z-10">
            <DatePicker
              isPopup={false}
              isOpen={isOpenDate}
              headerFormat="YYYY년 MM월 DD일"
              confirmText="확인"
              cancelText="취소"
              onCancel={() => setOpenDate(false)}
              onSelect={onSelectDate}
              dateConfig={{
                'year': {
                  format: 'YYYY',
                  caption: '년',
                  step: 1,
                },
                'month': {
                  format: 'M',
                  caption: '월',
                  step: 1,
                },
                'date': {
                  format: 'D',
                  caption: '일',
                  step: 1,
                },
              }}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};
