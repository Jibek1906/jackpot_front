import { Link } from 'react-router-dom';
import blink1 from '../assets/tv-page/table-num-blink-1.png';

interface TableSelectButtonProps {
  tableName: string;
  to: string;
  // Добавили знак вопроса, теперь пропс необязательный
  onClick?: () => void;
}

export default function TableSelectButton({
  tableName,
  to,
  onClick,
}: TableSelectButtonProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className='relative flex items-center justify-center w-full py-[20px] rounded-[6px] border-[0.1rem] border-[#FFB800]/50 bg-[#0c080d] hover:border-[#FFB800] hover:shadow-[0_0_15px_rgba(255,184,0,0.3)] transition-all'
    >
      <img
        src={blink1}
        className='w-full h-[4px] absolute -top-[2px] z-10 pointer-events-none opacity-80'
        alt=''
      />
      <img
        src={blink1}
        className='w-full h-[4px] absolute -bottom-[2px] z-10 pointer-events-none opacity-80'
        alt=''
      />

      <span className='font-montserrat text-[30px] font-bold leading-none bg-linear-to-b from-[#FFF8D6] via-[#FFB800] via-40% to-[#CC9300] text-transparent bg-clip-text uppercase'>
        {tableName}
      </span>
    </Link>
  );
}
