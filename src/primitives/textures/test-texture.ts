import { vec3 } from 'gl-matrix';
import { bilerp, norm } from '../../utils';

type Corners = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';

type QuadColors = Record<Corners, vec3>;

type QuadQuadColors = Record<Corners, QuadColors>;

export const generateTestTexture = (size: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Cannot get 2d context');
  }

  const sizeHalf = size / 2;
  const gridInterval = size / 10;
  const gridIntervalHalf = gridInterval / 2;

  const quadQuadColors: QuadQuadColors = {
    topLeft: {
      topLeft: [0, 111, 40],
      topRight: [255, 222, 40],
      bottomRight: [255, 234, 240],
      bottomLeft: [0, 111, 222],
    },
    topRight: {
      topLeft: [255, 216, 15],
      topRight: [205, 8, 1],
      bottomRight: [205, 15, 87],
      bottomLeft: [255, 234, 240],
    },
    bottomRight: {
      topLeft: [252, 234, 238],
      topRight: [14, 14, 14],
      bottomRight: [16, 10, 14],
      bottomLeft: [204, 3, 80],
    },
    bottomLeft: {
      topLeft: [206, 5, 85],
      topRight: [252, 233, 239],
      bottomRight: [0, 120, 212],
      bottomLeft: [17, 15, 92],
    },
  };

  const drawGradient = (
    xStart: number,
    xEnd: number,
    yStart: number,
    yEnd: number,
    colors: QuadColors,
  ): void => {
    const { topLeft, topRight, bottomRight, bottomLeft } = colors;
    for (let x = xStart; x <= xEnd + gridIntervalHalf - 1; x += gridIntervalHalf) {
      for (let y = yStart; y <= yEnd + gridIntervalHalf - 1; y += gridIntervalHalf) {
        const xNorm = norm(xStart, xEnd, x);
        const yNorm = norm(yStart, yEnd, y);
        const r = bilerp(topLeft[0], topRight[0], bottomRight[0], bottomLeft[0], xNorm, yNorm);
        const g = bilerp(topLeft[1], topRight[1], bottomRight[1], bottomLeft[1], xNorm, yNorm);
        const b = bilerp(topLeft[2], topRight[2], bottomRight[2], bottomLeft[2], xNorm, yNorm);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, y, gridIntervalHalf, gridIntervalHalf);
      }
    }
  };

  drawGradient(
    0,
    sizeHalf - gridIntervalHalf,
    0,
    sizeHalf - gridIntervalHalf,
    quadQuadColors.topLeft,
  );

  drawGradient(sizeHalf, size, 0, sizeHalf - gridIntervalHalf, quadQuadColors.topRight);

  drawGradient(sizeHalf, size, sizeHalf, size, quadQuadColors.bottomRight);

  drawGradient(0, sizeHalf - gridIntervalHalf, sizeHalf, size, quadQuadColors.bottomLeft);

  const offWhite = 'rgb(230, 230, 230)';
  const stroke = 'rgba(0, 0, 0, 0.1)';
  const numYellow = 'yellow';

  const charFontSize = size / 35;
  const charOffset = gridIntervalHalf * 0.2;
  const numFontSize = size / 60;
  const numOffset = [gridIntervalHalf * 2 - gridIntervalHalf * 0.2, gridIntervalHalf * 0.2];
  const strokeWidth = size / 500;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      if ((x + y) % 2 === 1) {
        continue;
      }
      const xx = x * gridInterval;
      const yy = y * gridInterval + gridInterval;
      const char = String.fromCharCode('A'.charCodeAt(0) + (y % 20));
      ctx.font = `${charFontSize}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.strokeText(char, xx + charOffset, yy - charOffset);
      ctx.fillStyle = offWhite;
      ctx.fillText(char, xx + charOffset, yy - charOffset);
      const num = String(x + 1).padStart(2, '0');
      ctx.font = `${numFontSize}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.strokeText(num, xx + numOffset[0], yy - numOffset[1]);
      ctx.fillStyle = numYellow;
      ctx.fillText(num, xx + numOffset[0], yy - numOffset[1]);
    }
  }

  const secondaryLineWidth = size / 1024;
  const secondaryLineWidthHalf = secondaryLineWidth / 2;
  ctx.fillStyle = offWhite;
  for (let i = gridIntervalHalf - secondaryLineWidthHalf; i <= size; i += gridInterval) {
    ctx.fillRect(i, 0, secondaryLineWidth, size);
    ctx.fillRect(0, i, size, secondaryLineWidth);
  }

  const mainLineWidth = size / 512;
  const mainLineWidthHalf = mainLineWidth / 2;
  ctx.fillStyle = offWhite;
  for (let i = -mainLineWidthHalf; i <= size; i += gridInterval) {
    ctx.fillRect(i, 0, mainLineWidth, size);
    ctx.fillRect(0, i, size, mainLineWidth);
  }

  const rivetSize = size / 200;
  const rivetOffset = rivetSize / 2;
  ctx.fillStyle = offWhite;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const xx = x * gridInterval;
      const yy = y * gridInterval;
      ctx.fillRect(xx + rivetOffset, yy + rivetOffset, rivetSize, rivetSize);
      ctx.fillRect(xx + gridInterval - rivetOffset * 3, yy + rivetOffset, rivetSize, rivetSize);
      ctx.fillRect(
        xx + gridInterval - rivetOffset * 3,
        yy + gridInterval - rivetOffset * 3,
        rivetSize,
        rivetSize,
      );
      ctx.fillRect(xx + rivetOffset, yy + gridInterval - rivetOffset * 3, rivetSize, rivetSize);
    }
  }

  return canvas;
};
