import {type HTMLAttributes, useLayoutEffect, useRef} from 'react';

type Props = HTMLAttributes<HTMLDivElement>;

/**
 * Programatically center the first item inside the container.
 */
const FirstItemCenterContainer = (props: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const container = containerRef.current;
    const firstItem = container.childNodes.item(0);
    if (firstItem instanceof HTMLElement) {
      const paddingTop = Math.max((container.clientHeight - firstItem.getBoundingClientRect().height) / 2, 0);
      container.style.setProperty('padding-top', `${paddingTop}px`);
    }
  }, []);

  return <div {...props} ref={containerRef}></div>;
};

export default FirstItemCenterContainer;
