export async function mergeImageNText(
  canvasContext,
  image,
  width = 0,
  height = 0,
  text = "",
  x = 0,
  y = 0
) {
  canvasContext.clearRect(0, 0, width, height);
  canvasContext.drawImage(image, 0, 0);

  const textWidth = canvasContext.measureText(text).width;
  // canvasContext.fillText(text, width / 2 - textWidth / 2, y);
  canvasContext.fillText(text, x, y);
}

export async function loadImage(url) {
  return new Promise((r) => {
    let i = new Image();
    i.onload = () => r(i);
    i.src = url;
  });
}

export function downloadImage(htmlATag, canvas, outputName) {
  const link = htmlATag;
  link.download = `${outputName}.png`;
  link.href = canvas.toDataURL();
  link.click();
}
