import {type RefObject, useEffect, useState} from 'react';

const useDownsizeSpeedometer = (speedometerOuterContainerElementRef: RefObject<HTMLDivElement | null>) => {
  const [shouldDownsizeSpeedometerInnerContainer, setShouldDownsizeSpeedometerContainer] = useState(false);

  useEffect(() => {
    const speedometerContainerElement = speedometerOuterContainerElementRef.current;
    if (speedometerContainerElement) {
      const observer = new IntersectionObserver(
        (entries) => {
          setShouldDownsizeSpeedometerContainer(entries[0].intersectionRatio < 0.8);
        },
        {threshold: 0.8},
      );

      observer.observe(speedometerContainerElement);
      return () => {
        observer.unobserve(speedometerContainerElement);
      };
    }
  }, [speedometerOuterContainerElementRef.current]);

  return shouldDownsizeSpeedometerInnerContainer;
};

export default useDownsizeSpeedometer;
