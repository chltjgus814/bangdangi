import React from 'react';
import {AiOutlineClose} from 'react-icons/ai';

export default function ImageCard({url, canDelete = true, isFirst = false, onDelete}) {
  return (
    <div
      className="relative w-24 h-24 rounded-lg bg-gray-500 flex items-center justify-center cursor-pointer bg-center bg-cover bg-no-repeat bg-fixed mr-4 mb-4"
      style={{backgroundImage: `url(${url})`}}>
      
      {isFirst ? (
        <div
          className="absolute opacity-5 bg-black text-white text-center top-0 left-0 px-2 rounded-lg text-sm font-bold"
          style={{top: '0.2rem', left: '0.2rem'}}
        >
          대표
        </div>
      ) : null}

      {canDelete ? (
        <div
          onClick={() => onDelete()}
          className="absolute opacity-50 bg-black w-6 h-6 rounded-full flex items-center justify-center z-10"
          style={{top: '-0.6rem', right: '-0.6rem'}}
        >
          <AiOutlineClose size="1rem" color="white" />
        </div>
      ) : null}
    </div>
  );
};
