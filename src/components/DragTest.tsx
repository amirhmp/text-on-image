import { useState } from "react";
import Draggable from "./Draggable";

function DragTest() {
  const [t, setT] = useState(0);
  const [l, setL] = useState(0);

  return (
    <div className="p-2">
      <div
        ref={(el) => {
          if (el) {
            setT(el.offsetTop);
            setL(el.offsetLeft);
          }
        }}
        className="h-screen bg-slate-900 relative"
      >
        <Draggable
          initLeft={12}
          initTop={12}
          parentOffsetTop={t}
          parentOffsetLeft={l}
          className="absolute shadow-sm rounded bg-green-900 select-none"
          onDragEnd={console.log}
        >
          <div className="p-24">ff</div>
        </Draggable>
      </div>
    </div>
  );
}

export default DragTest;
