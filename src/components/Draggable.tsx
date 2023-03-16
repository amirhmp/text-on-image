import React, {
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

interface IProps {
  parentOffsetTop: number;
  parentOffsetLeft: number;
  initTop?: number | undefined;
  initLeft?: number | undefined;
  className?: string | undefined;
  children?: ReactNode;
  onDragEnd?: ((x: number, y: number) => void) | undefined;
}

const Draggable = ({
  initTop = 0,
  initLeft = 0,
  parentOffsetLeft: parentLeft,
  parentOffsetTop: parentTop,
  className,
  children,
  onDragEnd,
}: IProps) => {
  const [isDragged, setDragged] = useState(false);
  const [pos, setPos] = useState({ left: initLeft, top: initTop });

  const elRef = React.useRef<HTMLDivElement | null>(null);

  const diffsRef = React.useRef({
    diffX: 0,
    diffY: 0,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      diffsRef.current.diffX = e.screenX - rect.left + parentLeft;
      diffsRef.current.diffY = e.screenY - rect.top + parentTop;
      setDragged(true);
    },
    [parentLeft, parentTop]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setDragged(false);
      const left = Math.round(e.screenX - diffsRef.current.diffX);
      const top = Math.round(e.screenY - diffsRef.current.diffY);
      setPos({
        left,
        top,
      });
      if (onDragEnd) {
        onDragEnd(left, top);
      }
    },
    [onDragEnd]
  );

  const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    elRef.current!.style.left = `${e.screenX - diffsRef.current.diffX}px`;
    elRef.current!.style.top = `${e.screenY - diffsRef.current.diffY}px`;
  }, []);

  useEffect(() => {
    if (isDragged) window.addEventListener("mousemove", onMouseMove as any);
    return () => {
      if (isDragged) {
        window.removeEventListener("mousemove", onMouseMove as any);
      }
    };
  }, [onMouseMove, isDragged]);

  return (
    <div
      ref={elRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={className}
      style={pos}
    >
      {children}
    </div>
  );
};

export default Draggable;
