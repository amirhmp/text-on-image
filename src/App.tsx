import { useRef } from "react";
import readXlsxFile from "read-excel-file";
import "./App.css";
import Button from "./components/Button";
import { downloadImage, loadImage, mergeImageNText } from "./utils/mimage";

async function main() {
  // const canvas = document.getElementById("myCanvas");
  // const ctx = canvas.getContext("2d");
  // ctx.font = "30px iransans";
  // ctx.fillStyle = "#000";
  // const link = document.createElement("a");
  // const bgImage = await loadImage("./assets/images/img.png");
  // const name = "امیرحسین مهدی پور"; // const names = readNamesFromExcel("./assets/names.xlsx");
  // const names = ["علی اکبر رستمی", "اصغر دهقان"];
  // for (let i = 0; i < names.length; i++) {
  //   const name = names[i];
  //   mergeImageNText(ctx, bgImage, canvas.width, canvas.height, name, 100, 100);
  //   downloadImage(link, canvas, `${i + 1}_${name}`);
  // }
}

function App() {
  const namesRef = useRef<Array<[string, string]>>([]);
  const bgImageRef = useRef<string | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onExcelUploaded = async ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const file = target!.files![0];
    const rows = await readXlsxFile(file);
    namesRef.current = rows as any;
  };

  const onBgImageUploaded = async ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const file = target!.files![0];
    bgImageRef.current = URL.createObjectURL(file);
    const bgImage = (await loadImage(bgImageRef.current)) as HTMLImageElement;
    console.log(bgImage.width, bgImage.height);

    const canvas = canvasRef.current!;
    canvas.width = bgImage.width;
    canvas.height = bgImage.height;
    const context = canvas!.getContext("2d")!;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bgImage, 0, 0);
  };

  const handleRun = () => {
    async function run() {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw Error("ctx is undefined");

      ctx.font = "30px iransans";
      ctx.fillStyle = "#000";
      const link = document.createElement("a");

      // const bgImage = await loadImage("./assets/images/img.png");
      const bgImage = await loadImage(bgImageRef.current);

      const names = namesRef.current;
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
          100,
          100
        );
        downloadImage(link, canvas, `${i + 1}_${name}`);
      }
    }

    run();
  };

  return (
    <div className="h-screen relative bg-slate-800 overflow-hidden">
      <div className="bg-slate-600 w-full absolute bottom-0 right-0 shadow-lg rounded-t">
        <div className="flex justify-center items-center gap-4">
          <div>
            <label htmlFor="input-image" className="button">
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
            <label htmlFor="input-excel" className="button">
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
          <div className="">
            <Button onClick={handleRun} title="Run" />
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        id="myCanvas"
        width="500"
        height="500"
        style={{ border: "1px solid #d3d3d3" }}
      >
        Your browser does not support the canvas element.
      </canvas>
    </div>
  );
}

export default App;
