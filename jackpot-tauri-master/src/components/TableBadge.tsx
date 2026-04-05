import blink from '../assets/tv-page/table-num-blink.png';
import blink1 from '../assets/tv-page/table-num-blink-1.png';
import TText from './TText';

export default function TableBadge({ tableName }: { tableName: string }) {
  return (
    <div className='z-0 absolute'>
      <img
        src={blink}
        alt=''
        className='w-full h-5 absolute -top-4.75 left-0 mix-blend-screen pointer-events-none'
      />
      <img
        src={blink1}
        className='w-full h-1 absolute -top-2.75 z-10 pointer-events-none'
        alt=''
      />
      <img
        src={blink1}
        className='w-full h-1 absolute -bottom-2.75 z-10 pointer-events-none'
        alt=''
      />
      <span className='font-montserrat text-4xl py-1.5 px-4 rounded-md font-bold border-[0.1rem] border-[#FFB800] leading-none bg-linear-to-b from-[#FFF8D6] via-[#FFB800] via-40% to-[#CC9300] text-transparent bg-clip-text flex items-center gap-2'>
        <TText tKey='tv.table' fallback='СТОЛ' />{' '}
        {tableName.replace(/стол|table/i, '').trim()}
      </span>
    </div>
  );
}