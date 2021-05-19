export const generateCheckerboardTexture = (size: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Cannot get 2d context');
  }

  const white = '#777777';
  const black = '#4e4e4e';
  const squares = 10;
  const squareSize = size / squares;
  for (let x = 0; x < squares; x++) {
    for (let y = 0; y < squares; y++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? white : black;
      ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
    }
  }

  return canvas;
};
