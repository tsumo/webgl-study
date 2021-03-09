import './style.css';

const init = (): void => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    console.error('Cannot get canvas context');
    return;
  }
};

init();
