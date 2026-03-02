import {range} from 'es-toolkit';

const SettingsIcon = () => {
  const x = (45 / 180) * Math.PI;
  const y = (15 / 180) * Math.PI;
  const r = 25;
  const h = 10;
  const rotate = range(Math.round((2 * Math.PI) / (x + y)));

  return (
    <svg className='stroke-4 stroke-black dark:stroke-white fill-none' viewBox='0 0 100 100'>
      <title>Settings</title>
      <circle cx='50' cy='50' r='15' />
      {rotate.map((value) => (
        <g
          key={value}
          style={{
            transform: `rotate(${(360 / rotate.length) * value}deg)`,
            transformOrigin: 'center',
          }}
        >
          <path
            d={`M 50 50
              m ${r * -Math.sin(x / 2)} ${-r * Math.cos(x / 2)}
              m 0 1.8
              l 0 ${-h} l ${2 * r * Math.sin(x / 2)} 0
              l 0 ${h}
              a ${r} ${r} 0 0 1 ${r * (Math.sin(x / 2 + y) - Math.sin(x / 2))} ${r * (Math.cos(x / 2) - Math.cos(x / 2 + y))}`}
          />
        </g>
      ))}
    </svg>
  );
};

export default SettingsIcon;
