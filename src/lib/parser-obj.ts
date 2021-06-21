import { BufferInitInfoFloat } from './types';

// TODO: construct index for repeating vertexes
export const parseObj = (
  obj: string,
  options = { yUp: true },
): {
  position: BufferInitInfoFloat;
  uv: BufferInitInfoFloat;
  normal: BufferInitInfoFloat;
} => {
  const v: number[] = [];
  const vt: number[] = [];
  const vn: number[] = [];
  // Split file into lines, drop empty lines, trim whitespace
  const lines = obj
    .trim()
    .split(/\n+/)
    .map((s) => s.trim());
  const positionData: number[] = [];
  const uvData: number[] = [];
  const normalData: number[] = [];
  lines.forEach((line, lineI) => {
    // comment mark may not have a space after it
    if (line.startsWith('#')) {
      return;
    }
    // datapoints can have more than 1 space between them
    const [keyword, ...data] = line.split(/\s+/);
    switch (keyword) {
      case 'v':
        v.push(...data.map(Number));
        break;
      case 'vt':
        vt.push(...data.map(Number));
        break;
      case 'vn':
        vn.push(...data.map(Number));
        break;
      case 'f':
        // f command can encode n-gons in a triangle fan format
        const numTriangles = data.length - 2;
        for (let tri = 0; tri < numTriangles; tri++) {
          [data[0], data[tri + 1], data[tri + 2]].forEach((vertex) => {
            let [vI, vtI, vnI] = vertex.split('/').map(Number);
            vI = (vI - 1) * 3;
            if (options.yUp) {
              positionData.push(v[vI], v[vI + 2], v[vI + 1]);
            } else {
              positionData.push(v[vI], v[vI + 1], v[vI + 2]);
            }
            if (vtI) {
              vtI = (vtI - 1) * 2;
              uvData.push(vt[vtI], vt[vtI + 1]);
            }
            if (vnI) {
              vnI = (vnI - 1) * 3;
              normalData.push(vn[vnI], vn[vnI + 1], vn[vnI + 2]);
            }
          });
        }
        break;
      case 'o': // object
      case 'mtllib': // material file reference
      case 'usemtl': // material reference
      case 'g': // groups
      case 's': // smoothing groups
        break;
      default:
        console.info(`[OBJ parser] Unknown keyword at line ${lineI + 1}: ${line}`);
        break;
    }
  });
  const position: BufferInitInfoFloat = {
    type: 'float',
    data: new Float32Array(positionData),
    size: 3,
  };
  const uv: BufferInitInfoFloat = {
    type: 'float',
    data: new Float32Array(uvData),
    size: 2,
  };
  const normal: BufferInitInfoFloat = {
    type: 'float',
    data: new Float32Array(normalData),
    size: 3,
  };
  return { position, uv, normal };
};
