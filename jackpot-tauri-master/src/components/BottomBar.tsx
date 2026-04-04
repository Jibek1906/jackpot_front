import TText from './TText';

export default function BottomBar() {
  return (
    <div className='flex items-center justify-between bg-[#0D0D12] rounded-full py-3 px-6 mt-8'>
      <div className='flex items-center gap-4 text-nowrap text-lg font-medium tracking-wide'>
        <img src='/bottom-bar/icon.svg' alt='' />
        <span><TText tKey="tv.play" fallback="ИГРАЙ" /></span>
        <span className='text-[#FFB800]'>•</span>
        <span className='text-[#FFB800]'><TText tKey="tv.win" fallback="ВЫИГРЫВАЙ" /></span>
        <span className='text-[#FFB800]'>•</span>
        <span><TText tKey="tv.take_jackpot" fallback="ЗАБИРАЙ ДЖЕКПОТ" /></span>
      </div>
      <div>
        <img src='/bottom-bar/img.png' alt='' className='h-6.5' />
      </div>
    </div>
  );
}