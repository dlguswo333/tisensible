import {range} from 'es-toolkit';
import {memo} from 'react';

type Props = {
  /** 0-360 in degree. */
  rotate: number;
};

const subScales = range(0, 32);

const Background = memo(() => {
  return (
    <>
      <circle cx='50' cy='50' r='20' className='fill-gray-100/30 dark:fill-sky-800/20' />
      {subScales.map((value) => (
        <g key={value}>
          <line
            style={{transform: `rotate(${(360 / subScales.length) * value}deg)`, transformOrigin: 'center'}}
            x1='30'
            x2='32'
            y1='50'
            y2='50'
            className='stroke-[0.1] stroke-gray-500 dark:stroke-gray-100'
          />
          <line
            style={{transform: `rotate(${(360 / subScales.length) * value}deg)`, transformOrigin: 'center'}}
            x1='2'
            x2='7'
            y1='50'
            y2='50'
            className='stroke-[0.75] stroke-gray-600 dark:stroke-gray-500'
          />
        </g>
      ))}
      <line x1='50' x2='50' y1='2' y2='12' className='stroke-2 stroke-red-600' />
      <text
        x='50'
        y='12'
        className='text-[0.6rem] fill-black dark:fill-white stroke-0'
        textAnchor='middle'
        dominantBaseline='hanging'
      >
        N
      </text>
      <line x1='50' x2='50' y1='98' y2='88' className='stroke-1 stroke-black dark:stroke-white' />
      <text
        x='50'
        y='87'
        className='text-[0.5rem] fill-black dark:fill-white stroke-0'
        textAnchor='middle'
        dominantBaseline='alphabetic'
      >
        S
      </text>
      <line x1='88' x2='98' y1='50' y2='50' className='stroke-1 stroke-black dark:stroke-white' />
      <text
        x='88'
        y='50.8'
        className='text-[0.5rem] fill-black dark:fill-white stroke-0'
        textAnchor='end'
        dominantBaseline='middle'
      >
        E
      </text>
      <line x1='2' x2='12' y1='50' y2='50' className='stroke-1 stroke-black dark:stroke-white' />
      <text
        x='12'
        y='50.5'
        className='text-[0.5rem] fill-black dark:fill-white stroke-0'
        textAnchor='start'
        dominantBaseline='middle'
      >
        W
      </text>
    </>
  );
});
Background.displayName = 'InnerCompass';

const Needle = memo(() => {
  return (
    <>
      <polygon points='50,32 52,50, 48,50' className='fill-red-600' />
      <polygon points='50,32 52,50, 50,50' className='fill-red-700/40' />
      <polygon points='50,68 52,50, 48,50' className='fill-blue-500' />
      <polygon points='50,68 48,50, 50,50' className='fill-blue-600/40' />
      <rect
        x='48'
        y='48'
        width='4'
        height='4'
        style={{transform: 'rotate(45deg)', transformOrigin: 'center'}}
        rx='1'
        className='fill-gray-600'
      />
    </>
  );
});
Needle.displayName = 'Needle';

const Compass = ({rotate}: Props) => {
  return (
    <div className='p-1 w-[90%] relative mx-auto max-w-2xl aspect-square'>
      <svg className='w-full h-full' viewBox='0 0 100 100'>
        <title>Compass</title>
        <g style={{transform: `rotate(${-1 * rotate}deg)`, transformOrigin: 'center'}}>
          <Background />
        </g>
        <g>
          <Needle />
        </g>
      </svg>
    </div>
  );
};

export default Compass;
