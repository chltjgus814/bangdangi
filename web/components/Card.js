import React, {useMemo} from 'react';

export default function Card({data, direction = 'horizontal'}) {
  const imageUrl = useMemo(() => {
    const {images} = data;
    if (images.length > 0) {
      return images[0]["image"];
    }
    return '';
  }, [data]);

  const title = useMemo(() => {
    const {deposit, rent} = data;
    
    if (rent > 0) {
      return `${deposit}/${rent}`;
    } else {
      return `${deposit}`;
    }
  }, [data]);

  return (
    <div className={`bg-white rounded-lg overflow-hidden ${direction === 'horizontal' ? 'max-w-full flex' : ''}`}>
      <div
        className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style={{backgroundImage: `url('${imageUrl}')`}}>
      </div>

      <div className="p-6">
        <div className="flex items-baseline">
          {data.contract.map((c, i) => (
            <div className="inline-block bg-blue-400 text-white text-xs px-2 rounded uppercase font-semibold tracking-wide" key={i}>{c}</div>
          ))}
        </div>
        <div className="font-extrabold text-3xl text-blue-400">{title}</div>
        <div className="font-bold text-gl text-gray-500">관리비 {data.expense}만원</div>
        <div></div>
        <div className="flex items-baseline mt-2">
          {data.keywords.map((k, i) => (
            <div className="inline-block bg-gray-500 text-white text-xs px-2 rounded uppercase font-semibold tracking-wide" key={i}>{k.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
