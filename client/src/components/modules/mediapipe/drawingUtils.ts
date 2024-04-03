import {NormalizedLandmark} from '@mediapipe/tasks-vision';

type Connection = {
  start: number;
  end: number;
};

type Callback<I, O> = (input: I) => O;

type LandmarkData = {
  index?: number;
  from?: NormalizedLandmark;
  to?: NormalizedLandmark;
}

type DrawingOptions = {
  color?: string|CanvasGradient|CanvasPattern|
      Callback<LandmarkData, string|CanvasGradient|CanvasPattern>;
  fillColor?: string|CanvasGradient|CanvasPattern|
      Callback<LandmarkData, string|CanvasGradient|CanvasPattern>;
  lineWidth?: number|Callback<LandmarkData, number>;
  radius?: number|Callback<LandmarkData, number>;
}


const DEFAULT_OPTIONS: DrawingOptions = {
  color: 'white',
  lineWidth: 4,
  radius: 6
};

function addDefaultOptions(style?: DrawingOptions): DrawingOptions {
  style = style || {};
  return {
    ...DEFAULT_OPTIONS,
    ...{fillColor: style.color},
    ...style,
  };
}


function resolve<O, I>(value: O|Callback<I, O>, data: I): O {
  return value instanceof Function ? value(data) : value;
}

export function  drawLandmarks(ctx: any, landmarks?: NormalizedLandmark[], style?: DrawingOptions):
      void {
    if (!landmarks) {
      return;
    }
    const options = addDefaultOptions(style);
    ctx.save();
    const canvas = ctx.canvas;
    let index = 0;
    for (const landmark of landmarks) {
      // All of our points are normalized, so we need to scale the unit canvas
      // to match our actual canvas size.
      ctx.fillStyle = resolve(options.fillColor!, {index, from: landmark});
      ctx.strokeStyle = resolve(options.color!, {index, from: landmark});
      ctx.lineWidth = resolve(options.lineWidth!, {index, from: landmark});

      const circle = new Path2D();
      // Decrease the size of the arc to compensate for the scale()
      circle.arc(
          landmark.x * canvas.width, landmark.y * canvas.height,
          resolve(options.radius!, {index, from: landmark}), 0, 2 * Math.PI);
      ctx.fill(circle);
      ctx.stroke(circle);
      ++index;
    }
    ctx.restore();
  }

export function  drawConnectors(ctx: any,
      landmarks?: NormalizedLandmark[], connections?: Connection[],
      style?: DrawingOptions): void {
    if (!landmarks || !connections) {
      return;
    }
    const options = addDefaultOptions(style);
    ctx.save();
    const canvas = ctx.canvas;
    let index = 0;
    for (const connection of connections) {
      ctx.beginPath();
      const from = landmarks[connection.start];
      const to = landmarks[connection.end];
      if (from && to) {
        ctx.strokeStyle = resolve(options.color!, {index, from, to});
        ctx.lineWidth = resolve(options.lineWidth!, {index, from, to});
        ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
        ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
      }
      ++index;
      ctx.stroke();
    }
    ctx.restore();
  }