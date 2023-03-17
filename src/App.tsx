import React, { useCallback, useRef, useState } from "react";
import readXlsxFile from "read-excel-file";
import "./App.css";
import Button from "./components/Button";
import Draggable, { IDraggableRef } from "./components/Draggable";
import DropDown from "./components/DropDown";
import { downloadImage, loadImage, mergeImageNText } from "./utils/mimage";

const alignments: Array<{ title: string; value: CanvasTextAlign }> = [
  { title: "Center", value: "center" },
  { title: "RTL", value: "right" },
  { title: "LTR", value: "left" },
];

function App() {
  const [names, setNames] = useState<Array<[string, string]>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [bgImageUrl, setBgImageUrl] = useState<string | undefined>(undefined);
  const [textAlign, setTextAlign] = useState(alignments[0]);
  const [color, setColor] = useState("#000");
  const [fontSize, setFontSize] = useState("30");
  const xDragRef = useRef<IDraggableRef | null>(null);

  const onExcelUploaded = async ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const file = target!.files![0];
    const rows = await readXlsxFile(file);
    setNames(rows as any);
  };

  const onBgImageUploaded = async ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const file = target!.files![0];
    const bgImageUrl = URL.createObjectURL(file);
    const bgImage = (await loadImage(bgImageUrl)) as HTMLImageElement;
    console.log(bgImage.width, bgImage.height);

    const canvas = canvasRef.current!;
    canvas.width = bgImage.width;
    canvas.height = bgImage.height;
    const context = canvas!.getContext("2d")!;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bgImage, 0, 0);
    xDragRef.current!.setX(bgImage.width / 2 - 8);
    setBgImageUrl(bgImageUrl);
  };

  const handleRun = () => {
    async function run() {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw Error("ctx is undefined");

      ctx.font = `${fontSize}px iransans`;
      ctx.fillStyle = color;
      ctx.textBaseline = "middle";
      ctx.textAlign = textAlign.value;
      const link = document.createElement("a");

      // const bgImage = await loadImage("./assets/images/img.png");
      const bgImage = await loadImage(bgImageUrl);

      if (names.length === 0)
        return console.log("excel not selected or is empty");

      console.log("running...", names);

      for (let i = 0; i < names.length; i++) {
        const name = names[i].join(" ");
        mergeImageNText(
          ctx,
          bgImage,
          canvas.width,
          canvas.height,
          name,
          textPos.current.x,
          textPos.current.y
        );
        downloadImage(link, canvas, `${i + 1}_${name}`);
      }
    }

    run();
  };

  const handleYPos = useCallback((x: number, y: number) => {
    textPos.current.y = y + 24;
  }, []);

  const handleXPos = useCallback((x: number, y: number) => {
    textPos.current.x = x;
  }, []);

  return (
    <div className="h-screen relative bg-slate-800 overflow-hidden cursor-row-resize">
      <div className="relative">
        <Draggable
          className={`h-12 bg-red-400/70 ${bgImageUrl ? "" : "hidden"}`}
          style={{ width: canvasRef.current?.width }}
          parentOffsetTop={0}
          parentOffsetLeft={0}
          disableX
          onDragEnd={handleYPos}
        >
          <Draggable
            ref={xDragRef}
            className="w-4 h-full bg-green-400 cursor-col-resize"
            parentOffsetTop={0}
            parentOffsetLeft={0}
            disableY
            onDragEnd={handleXPos}
          ></Draggable>
        </Draggable>

        <canvas
          ref={canvasRef}
          id="myCanvas"
          width={0}
          height={0}
          style={{ border: "1px solid #d3d3d3" }}
        >
          Your browser does not support the canvas element.
        </canvas>
      </div>
      <div className="bg-slate-600 w-full absolute bottom-0 right-0 shadow-lg rounded-t">
        <div className="flex justify-center items-center gap-4">
          <div>
            <label
              htmlFor="input-image"
              className={`button ${
                bgImageUrl !== undefined ? "!bg-green-500" : ""
              }`}
            >
              Select Background Image
            </label>
            <input
              className="hidden"
              id="input-image"
              type="file"
              accept="image/*"
              onChange={onBgImageUploaded}
            />
          </div>
          <div>
            <label
              htmlFor="input-excel"
              className={`button ${names.length !== 0 ? "!bg-green-500" : ""}`}
            >
              Select Excel
            </label>
            <input
              className="hidden"
              type="file"
              id="input-excel"
              accept=".xlsx"
              onChange={onExcelUploaded}
            />
          </div>
          <DropDown
            items={alignments}
            titleExtractor={(type) => type.title}
            valueExtractor={(type) => type.value + ""}
            selectedItem={textAlign}
            onChange={(t) => setTextAlign(t)}
          />

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <input
            type="text"
            className="w-12 text-center"
            placeholder="fontsize"
            value={fontSize}
            maxLength={2}
            onChange={(e) => setFontSize(e.target.value)}
          />
          <Button
            onClick={handleRun}
            disabled={
              names.length === 0 || bgImageUrl === undefined || !fontSize
            }
            title="Run"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
