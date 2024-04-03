import React, { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

import { drawLandmarks, drawConnectors } from "./mediapipe/drawingUtils";

import DisplayBlock from "./DisplayBlock";

import "./CamCanvas.css";

type Props = {
  towerProps: {
    radius: number;
    height: number;
    gradient: number;
    numPoints: number;
    phi: number;
    numSegments: number;
  };
  setTowerProps: React.Dispatch<
    React.SetStateAction<{
      radius: number;
      height: number;
      gradient: number;
      numPoints: number;
      phi: number;
      numSegments: number;
    }>
  >;
};

const CamCanvas = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | undefined>(undefined);
  const visionRef = useRef<any>(undefined); // TODO: resolve WasmFileset type

  const animateIdRef = useRef<number | null>(null);

  const [camRunning, setCamRunning] = useState<boolean>(false);
  const [predicting, setPredicting] = useState<boolean>(false);

  const MODEL_PATH = `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`;
  const BASE_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm`;

  useEffect(() => {
    const createHandLandmarker = async () => {
      visionRef.current = await FilesetResolver.forVisionTasks(BASE_WASM);

      handLandmarkerRef.current = await HandLandmarker.createFromOptions(visionRef.current, {
        baseOptions: {
          modelAssetPath: MODEL_PATH,
          // delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });
    };

    createHandLandmarker();

    return () => {
      handLandmarkerRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!camRunning) {
      return;
    }

    if (!navigator.mediaDevices.getUserMedia) {
      setCamRunning(false);
      alert("getUserMedia() is not supported!");
      return;
    }

    const getVideoStream = async () => {
      videoRef.current!.addEventListener("loadedmetadata", () => {
        canvasRef.current!.width = videoRef.current!.videoWidth;
        canvasRef.current!.height = videoRef.current!.videoHeight;
      });

      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current!.srcObject = streamRef.current;
    };

    getVideoStream();
  }, [camRunning]);

  useEffect(() => {
    if (!predicting) {
      return;
    }

    if (!streamRef.current) {
      setPredicting(false);
      alert("Wait! Video stream is not loaded!");
      return;
    }

    if (!handLandmarkerRef.current) {
      setPredicting(false);
      alert("Wait! Please wait for the handLandmarker to load");
      return;
    }

    const runDetection = () => {
      const ctx = canvasRef.current!.getContext("2d")!;

      const getDetectResults = async (video: HTMLVideoElement) => {
        let lastVideoTime = -1;
        let startTimeMs = performance.now();

        if (lastVideoTime !== video.currentTime) {
          lastVideoTime = video.currentTime;
          return handLandmarkerRef.current!.detectForVideo(video, startTimeMs);
        }
      };

      const draw = async () => {
        const results = await getDetectResults(videoRef.current!);
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

        if (results?.landmarks) {
          results.landmarks.forEach((landmarks: any) => {
            drawLandmarks(ctx, landmarks, { color: "#FF00ff", lineWidth: 2 });
            drawConnectors(ctx, landmarks, HandLandmarker.HAND_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 5,
            });
          });
          updateRadius(results.landmarks);
          updateGradient(results.landmarks);
        }

        animateIdRef.current = requestAnimationFrame(draw);
      };

      draw();
    };

    runDetection();

    return () => {
      cancelAnimationFrame(animateIdRef.current!);
      canvasRef
        .current!.getContext("2d")!
        .clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    };
  }, [predicting]);

  const handleCam = () => {
    if (camRunning) {
      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
      setCamRunning(false);
    } else {
      setCamRunning(true);
    }
  };

  const handlePredict = () => {
    if (predicting) {
      setPredicting(false);
    } else {
      setPredicting(true);
    }
  };

  const updateRadius = (landmarks: Array<Array<any>>) => {
    try {
      const left = landmarks[0];
      const right = landmarks[1];

      let result = 0;
      for (let i = 5; i <= 8; i++) {
        result += (Math.abs(left[i].x - right[i].x) * 2.8) / 4;
      }

      props.setTowerProps((prev) => ({ ...prev, radius: result }));
    } finally {
      return;
    }
  };

  const updateGradient = (landmarks: Array<Array<any>>) => {
    try {
      const left = landmarks[0];
      const right = landmarks[1];

      const x11 = left[5].x;
      const y11 = left[5].y;
      const x12 = left[8].x;
      const y12 = left[8].y;
      const x21 = right[5].x;
      const y21 = right[5].y;
      const x22 = right[8].x;
      const y22 = right[8].y;

      const dotProduct = (x12 - x11) * (x22 - x21) + (y12 - y11) * (y22 - y21);
      if (dotProduct < 0) {
        props.setTowerProps((prev) => ({ ...prev, gradient: 8 }));
        return;
      }
      const lenSq1 = Math.sqrt((x12 - x11) * (x12 - x11) + (y12 - y11) * (y12 - y11));
      const lenSq2 = Math.sqrt((x22 - x21) * (x22 - x21) + (y22 - y21) * (y22 - y21));

      const result = (4 * dotProduct) / (lenSq1 * lenSq2);

      props.setTowerProps((prev) => ({ ...prev, gradient: result }));
    } finally {
      return;
    }
  };

  return (
    <div className="u-flexColumn">
      <div className="u-flex">
        <button onClick={handleCam}>{camRunning ? "Close Webcam" : "Open Webcam"}</button>
        <button onClick={handlePredict}>
          {predicting ? "Stop Prediction" : "Start Prediction"}
        </button>
        <DisplayBlock name="radius" value={props.towerProps.radius} />
        <DisplayBlock name="gradient" value={props.towerProps.gradient} />
      </div>
      <div className="CamCanvas-container">
        <video className="CamCanvas-video" ref={videoRef} autoPlay playsInline />
        <canvas className="CamCanvas-canvas" ref={canvasRef} />
      </div>
    </div>
  );
};

export default CamCanvas;
