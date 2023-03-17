import React, {
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

interface IProps {
  parentOffsetTop: number;
  parentOffsetLeft: number;
  initTop?: number | undefined;
  initLeft?: number | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  children?: ReactNode;
  onDragEnd?: ((x: number, y: number) => void) | undefined;
  disableX?: boolean | undefined;
  disableY?: boolean | undefined;
}

export interface IDraggableRef {
  setPosition: (x: number, y: number) => void;
  setX: (x: number) => void;
  setY: (y: number) => void;
}

const Draggable = React.forwardRef<IDraggableRef, IProps>(
  (props, forwardedRef) => {
    const {
      initTop = 0,
      initLeft = 0,
      parentOffsetLeft: parentLeft,
      parentOffsetTop: parentTop,
      className,
      style,
      children,
      onDragEnd,
      disableX = false,
      disableY = false,
    } = props;

    const [isDragged, setDragged] = useState(false);
    const [pos, setPos] = useState({ left: initLeft, top: initTop });

    useEffect(() => {
      console.log(pos);
    }, [pos]);

    const setPosition = useCallback(
      (x: number, y: number) => {
        setPos({ left: x, top: y });
        if (onDragEnd) onDragEnd(x, y);
      },
      [onDragEnd]
    );

    const setX = useCallback(
      (x: number) => setPosition(x, pos.top),
      [pos.top, setPosition]
    );

    const setY = useCallback(
      (y: number) => setPosition(pos.left, y),
      [pos.left, setPosition]
    );

    useImperativeHandle(
      forwardedRef,
      () => ({
        setPosition,
        setX,
        setY,
      }),
      [setPosition, setX, setY]
    );

    const elRef = React.useRef<HTMLDivElement | null>(null);

    const diffsRef = React.useRef({
      diffX: 0,
      diffY: 0,
    });

    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
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
        const left = disableX
          ? pos.left
          : Math.round(e.screenX - diffsRef.current.diffX);
        const top = disableY
          ? pos.top
          : Math.round(e.screenY - diffsRef.current.diffY);
        setPos({
          left,
          top,
        });
        if (onDragEnd) {
          onDragEnd(left, top);
        }
      },
      [disableX, disableY, onDragEnd, pos.left, pos.top]
    );

    const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
      (e) => {
        if (!disableX)
          elRef.current!.style.left = `${e.screenX - diffsRef.current.diffX}px`;
        if (!disableY)
          elRef.current!.style.top = `${e.screenY - diffsRef.current.diffY}px`;
      },
      [disableX, disableY]
    );

    useEffect(() => {
      if (isDragged) window.addEventListener("mousemove", onMouseMove as any);
      return () => {
        if (isDragged) {
          window.removeEventListener("mousemove", onMouseMove as any);
        }
      };
    }, [onMouseMove, isDragged]);

    useEffect(() => {
      if (isDragged) window.addEventListener("mouseup", handleMouseUp as any);
      return () => {
        if (isDragged)
          window.removeEventListener("mouseup", handleMouseUp as any);
      };
    }, [handleMouseUp, isDragged]);

    return (
      <div
        ref={elRef}
        onMouseDown={handleMouseDown}
        className={`${className} !absolute`}
        style={{ ...style, ...pos }}
      >
        {children}
      </div>
    );
  }
);

export default Draggable;
