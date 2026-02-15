type Props = {
  /** 0-360 in degree. */
  rotate: number;
};

const Compass = ({rotate}: Props) => {
  return (
    <div className='p-1 w-[90%] relative mx-auto max-w-2xl aspect-square'>
      <svg className='w-full h-full' viewBox='0 0 100 100'>
        <title>Compass</title>
        <g style={{transform: `rotate(${-1 * rotate}deg)`, transformOrigin: 'center'}}>
          <line x1='50' x2='50' y1='2' y2='12' className='stroke-2 stroke-red-600' />
          <text
            x='50'
            y='11'
            className='text-xs fill-black dark:fill-white stroke-0'
            textAnchor='middle'
            dominantBaseline='hanging'
          >
            N
          </text>
          <line x1='50' x2='50' y1='98' y2='88' className='stroke-2 stroke-black dark:stroke-white' />
          <text
            x='50'
            y='87'
            className='text-[0.5rem] fill-black dark:fill-white stroke-0'
            textAnchor='middle'
            dominantBaseline='alphabetic'
          >
            S
          </text>
          <line x1='88' x2='98' y1='50' y2='50' className='stroke-2 stroke-black dark:stroke-white' />
          <text
            x='88'
            y='50.8'
            className='text-[0.5rem] fill-black dark:fill-white stroke-0'
            textAnchor='end'
            dominantBaseline='middle'
          >
            E
          </text>
          <line x1='2' x2='12' y1='50' y2='50' className='stroke-2 stroke-black dark:stroke-white' />
          <text
            x='12'
            y='50.5'
            className='text-[0.5rem] fill-black dark:fill-white stroke-0'
            textAnchor='start'
            dominantBaseline='middle'
          >
            W
          </text>
          <circle cx='50' cy='50' r='48' className='fill-none stroke-1 stroke-black dark:stroke-white' />
        </g>
        <g>
          <line x1='50' x2='50' y1='45' y2='55' className='stroke-2 stroke-sky-800' />
        </g>
      </svg>
    </div>
  );
};

export default Compass;
