export const goldNumbers: Record<string, string> = {
  '0': '/numbers/gold/0.png',
  '1': '/numbers/gold/1.png',
  '2': '/numbers/gold/2.png',
  '3': '/numbers/gold/3.png',
  '4': '/numbers/gold/4.png',
  '5': '/numbers/gold/5.png',
  '6': '/numbers/gold/6.png',
  '7': '/numbers/gold/7.png',
  '8': '/numbers/gold/8.png',
  '9': '/numbers/gold/9.png',
  $: '/numbers/gold/$.png',
};

export interface Fishka {
  id: number;
  multiplier: string;
  image: string;
  name: string;
  percent?: string;
}

export const fishki: Fishka[] = [
  { id: 1, multiplier: 'X1', image: '/fishki/x2.png', name: 'ЧЕРНЫЙ ЧИП' },
  { id: 2, multiplier: 'X2', image: '/fishki/x3.png', name: 'СЕРЫЙ ЧИП' },
  { id: 3, multiplier: 'X3', image: '/fishki/x4.png', name: 'БЕЛЫЙ ЧИП' },
  { id: 4, multiplier: 'X4', image: '/fishki/x5.png', name: 'СИНИЙ ЧИП' },
  { id: 5, multiplier: 'X5', image: '/fishki/x6.png', name: 'ЗЕЛЕНЫЙ ЧИП' },
  {
    id: 6,
    multiplier: 'X6',
    image: '/fishki/x7.png',
    name: 'ЖЕЛТЫЙ ЧИП',
    percent: '10%',
  },
  {
    id: 7,
    multiplier: 'X7',
    image: '/fishki/x8.png',
    name: 'ОРАНЖЕВЫЙ ЧИП',
    percent: '15%',
  },
  {
    id: 8,
    multiplier: 'X8',
    image: '/fishki/x9.png',
    name: 'КРАСНЫЙ ЧИП',
    percent: '20%',
  },
  {
    id: 9,
    multiplier: 'X9',
    image: '/fishki/x10.png',
    name: 'ФИОЛЕТОВЫЙ ЧИП',
    percent: '30%',
  },
  {
    id: 10,
    multiplier: 'X10',
    image: '/fishki/x11.png',
    name: 'СЕРЕБРЯНЫЙ ЧИП',
    percent: '50%',
  },
  {
    id: 11,
    multiplier: 'X11',
    image: '/fishki/x12.png',
    name: 'ЗОЛОТОЙ ЧИП',
    percent: '100%',
  },
];
