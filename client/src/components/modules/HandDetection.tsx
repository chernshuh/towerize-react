import React, { useRef, useEffect, useState } from "react";
import {
  HandLandmarker,
  FilesetResolver,
  HandLandmarkerResult,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

import "./HandDetection.css";

type Connection = {
  start: number;
  end: number;
};

const convertToConnections = (...connections: Array<[number, number]>): Connection[] => {
  return connections.map(([start, end]) => ({ start, end }));
};

const HAND_CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
];

const HandDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enableCamButtonRef = useRef<HTMLButtonElement>(null);
  const enablePredictionButtonRef = useRef<HTMLButtonElement>(null);
  const animationIdRef = useRef<number | null>(null);

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  // const [resultLandmarks, setResultLandmarks] = useState<HandLandmarkerResult | null>(null);
  const [isPredicting, setIsPredicting] = useState<Boolean>(false);

  const MODEL_PATH = `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`;
  const BASE_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm`;

  // let handLandmarker: HandLandmarker | undefined = undefined;

  const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(BASE_WASM);

    return HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_PATH,
        // delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });
  };

  // createHandLandmarker();

  const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

  const getVideoStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    setVideoStream(stream);
  };

  const stopVideoStream = () => {
    videoStream?.getTracks().forEach((track) => {
      track.stop();
    });
    setVideoStream(null);
  };

  const handleWebcam = () => {
    if (videoStream) {
      stopVideoStream();
      enableCamButtonRef.current!.textContent = "Start Webcam";
    } else {
      if (hasGetUserMedia()) {
        getVideoStream();
        enableCamButtonRef.current!.textContent = "Stop Webcam";
      } else {
        alert("getUserMedia() is not supported by your browser");
      }
    }
  };

  const handlePrediction = () => {
    if (isPredicting) {
      setIsPredicting(false);
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
      enablePredictionButtonRef.current!.textContent = "Enable Prediction";
      return;
    } else {
      setIsPredicting(true);
      enablePredictionButtonRef.current!.textContent = "Disable Prediction";
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  useEffect(() => {
    const runDetection = async () => {
      if (!isPredicting) {
        return;
      }

      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.log("canvas ctx is null");
          return;
        }

        const handLandmarker = await createHandLandmarker();

        const draw = () => {
          let lastVideoTime = -1;
          let startTimeMs = performance.now();
          let results: HandLandmarkerResult | undefined = undefined;

          if (videoRef.current) {
            const video = videoRef.current;
            if (lastVideoTime !== video.currentTime) {
              lastVideoTime = video.currentTime;
              results = handLandmarker.detectForVideo(video, startTimeMs);
            }
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }

          const drawingUtils = new DrawingUtils(ctx);

          const drawConnectors = drawingUtils.drawConnectors;
          const drawLandmarks = drawingUtils.drawLandmarks;

          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results && results.landmarks) {
            results.landmarks.forEach((landmarks) => {
              drawConnectors(landmarks, convertToConnections(...HAND_CONNECTIONS), {
                color: "#00FF00",
                lineWidth: 5,
              });
              drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 2 });
            });
          }

          ctx.restore();

          animationIdRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
          animationIdRef.current ? cancelAnimationFrame(animationIdRef.current) : null;
        };
      }
    };

    runDetection();
  }, [isPredicting]);

  return (
    <div>
      <div>
        <div className="HD-container">
          <video className="HD-video" ref={videoRef} autoPlay playsInline />
          <canvas className="HD-canvas" ref={canvasRef} />
        </div>
        <button ref={enableCamButtonRef} onClick={handleWebcam}>
          Start Webcam
        </button>
        <button ref={enablePredictionButtonRef} onClick={handlePrediction}>
          Enable Prediction
        </button>
      </div>
    </div>
  );
};

export default HandDetection;
