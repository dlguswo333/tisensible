const CompassIcon = () => {
  return (
    <svg viewBox='0 0 100 100'>
      <title>Compass</title>
      <g className='stroke-4 stroke-black dark:stroke-white fill-none'>
        <circle cx='50' cy='50' r='35' />
      </g>
      <g className='stroke-none fill-black dark:fill-white'>
        <polygon points='50,20 56,50, 44,50' />
        <polygon points='50,80 56,50, 44,50' />
      </g>
    </svg>
  );
};

export default CompassIcon;
