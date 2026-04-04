import { ReactNode } from 'react';
import pseudoEl from '../assets/pseudo-el.png';

interface SectionTitleProps {
  highlightText: ReactNode;
  text?: ReactNode;
}

export default function SectionTitle({
  highlightText,
  text,
}: SectionTitleProps) {
  return (
    <div className='flex items-center text-2xl font-bold mb-2.5'>
      <span className='text-[#EFB64B] mr-2'>{highlightText}</span>
      {text && <span>{text}</span>}
      <div className='flex-1 ml-7.75 min-w-0 flex items-center h-1'>
        <img
          src={pseudoEl}
          alt=''
          className='w-full h-full object-contain object-left pointer-events-none'
        />
      </div>
    </div>
  );
}
