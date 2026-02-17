import {memo} from 'react';

type Props = {
  value: number | null;
};
type DigitDisplayProps = {
  /** Single digit integer 0-9. */
  value: number | null;
};

const offClassName = 'fill-slate-300/50 dark:fill-slate-500/50';
const onClassName = 'fill-green-500';

const truthTable = {
  a: '1011011111',
  b: '1111100111',
  c: '1101111111',
  d: '1011011011',
  e: '1010001010',
  f: '1000111011',
  g: '0011111011',
} as const;

const DigitDisplay = memo(({value}: DigitDisplayProps) => {
  return (
    <svg className='min-w-0 flex-1 overflow-visible' viewBox='0 0 50 98'>
      <title>Display</title>
      <polygon
        className={value !== null && truthTable.a[value] === '1' ? onClassName : offClassName}
        points=' 5, 7  8, 4 42, 4 45, 7 42,10  8,10'
      />
      <polygon
        className={value !== null && truthTable.b[value] === '1' ? onClassName : offClassName}
        points='45, 8 48,11 48,45 45,48 42,45 42,11'
      />
      <polygon
        className={value !== null && truthTable.c[value] === '1' ? onClassName : offClassName}
        points='45,50 48,53 48,87 45,90 42,87 42,53'
      />
      <polygon
        className={value !== null && truthTable.d[value] === '1' ? onClassName : offClassName}
        points=' 5,91  8,88 42,88 45,91 42,94  8,94'
      />
      <polygon
        className={value !== null && truthTable.e[value] === '1' ? onClassName : offClassName}
        points=' 5,50  8,53  8,87  5,90  2,87  2,53'
      />
      <polygon
        className={value !== null && truthTable.f[value] === '1' ? onClassName : offClassName}
        points=' 5, 8  8,11  8,45  5,48  2,45  2,11'
      />
      <polygon
        className={value !== null && truthTable.g[value] === '1' ? onClassName : offClassName}
        points=' 5,49  8,46 42,46 45,49 42,52  8,52'
      />
    </svg>
  );
});
DigitDisplay.displayName = 'DigitDisplay';

const Speedometer = ({value}: Props) => {
  const quantizedValue = value !== null ? [...Math.round(value).toString().padStart(2, '0')].map(Number) : null;

  return (
    <div
      className={`p-3 w-full max-h-[70vh] landscape:max-h-70vh bg-gray-100 dark:bg-gray-700 ${quantizedValue === null ? 'brightness-30' : ''} rounded-2xl flex flex-row flex-nowrap justify-center gap-3`}
    >
      {quantizedValue !== null ? (
        quantizedValue.map((digit, index) => {
          // biome-ignore lint/suspicious/noArrayIndexKey: No other option.
          return <DigitDisplay key={index} value={digit} />;
        })
      ) : (
        <>
          <DigitDisplay value={null} />
          <DigitDisplay value={null} />
        </>
      )}
    </div>
  );
};

export default Speedometer;
