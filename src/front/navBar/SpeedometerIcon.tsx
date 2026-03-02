const SpeedometerIcon = () => {
  return (
    <svg className='stroke-4 stroke-black dark:stroke-white fill-none' viewBox='0 0 100 100'>
      <title>Speedometer</title>
      <path d='M 10 60 A 40 40 0 0 1 90 60' style={{strokeLinecap: 'round'}} />
      <circle cx='50' cy='70' r='6' className='stroke-none fill-black dark:fill-white' />
      <path d='M 50 70 l 25 -25' />
    </svg>
  );
};

export default SpeedometerIcon;
