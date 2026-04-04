import { ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
}

export default function GlowCard({
  children,
  className = '',
  wrapperClassName = '',
}: GlowCardProps) {
  const isAnimated = true;

  return (
    <div
      className={`
        relative 
        overflow-hidden
        p-[0.0625rem] 
        rounded-4xl 
        shadow-[0_0.9375rem_2.5rem_rgba(0,0,0,0.8)] 
        ${wrapperClassName}
      `}
    >
      {isAnimated ? (
        // <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square animate-[spin_4s_linear_infinite] bg-[conic-gradient(transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%,rgba(255,255,255,0.4)_100%)] z-0' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] bg-linear-to-br from-white/30 via-transparent to-white/30 z-0 aspect-square animate-[spin_4s_linear_infinite]' />
      ) : (
        <div className='absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-white/30 z-0' />
      )}

      <div
        className={`
          relative
          z-10
          bg-[#0c080d]/50 /* 1. Сделали фон прозрачным на 80% */
          backdrop-blur-4xl /* 2. Добавили размытие заднего фона */
          rounded-[calc(2rem-0.0625rem)] 
          w-full 
          h-full 
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
}
