import React, { useState, useRef, useEffect } from "react";
import { post } from "../../utilities";

import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { drawLandmarks, drawConnectors } from "../modules/mediapipe/drawingUtils";

import TowerAdjustable from "../modules/TowerAdjustable";
import "./Creation.css";
import { create } from "ts-node";

type Props = { userId: string | undefined };

const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const BASE_WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm";

const Creation = (props: Props) => {
  const [tower, setTower] = useState({ radius: 0.7, gradient: 4 });
  const handleSave = () => {
    if (props.userId) {
      const body = tower;
      post("/api/tower", body).then((tower) => console.log(tower));
    } else {
      alert("Please log in to save your tower.");
    }
  };

  const [camRunning, setCamRunning] = useState<boolean>(false);
  const [predicting, setPredicting] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countdownCanvasRef = useRef<HTMLCanvasElement>(null);
  const countdownFrom = 5;
  let countdown = countdownFrom;

  const onComplete = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillText("Complete", ctx.canvas.width / 2, ctx.canvas.height / 2);
    setTimeout(() => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      setPredicting(false);
    }, 1000);
  };

  const streamRef = useRef<MediaStream | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | undefined>(undefined);
  const visionRef = useRef<any>(undefined);

  const animateIdRef = useRef<number | null>(null);
  const countdownAnimateIdRef = useRef<number | null>(null);

  const countdownDraw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#cc0000";

    ctx.fillText(countdown.toString(), ctx.canvas.width / 2, ctx.canvas.height / 2);
  };

  const countdownAnimate = (ctx) => {
    countdownDraw(ctx);
    if (countdown > 0) {
      setTimeout(() => {
        countdown -= 1;
        countdownAnimateIdRef.current = requestAnimationFrame(() => countdownAnimate(ctx));
      }, 1000);
    } else {
      if (onComplete) {
        onComplete(ctx);
      }
    }
  };

  // Load createHandLandmarker on component mount
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

  const handleCam = () => {
    if (camRunning) {
      if (predicting) {
        setPredicting(false);
      }
      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
      setCamRunning(false);
    } else {
      setCamRunning(true);
    }
  };

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
        countdownCanvasRef.current!.width = videoRef.current!.videoWidth;
        countdownCanvasRef.current!.height = videoRef.current!.videoHeight;
      });

      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current!.srcObject = streamRef.current;
    };

    getVideoStream();
  }, [camRunning]);

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

      setTower((prev) => ({ ...prev, radius: result }));
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
        setTower((prev) => ({ ...prev, gradient: 8 }));
        return;
      }
      const lenSq1 = Math.sqrt((x12 - x11) * (x12 - x11) + (y12 - y11) * (y12 - y11));
      const lenSq2 = Math.sqrt((x22 - x21) * (x22 - x21) + (y22 - y21) * (y22 - y21));

      const result = (4 * dotProduct) / (lenSq1 * lenSq2);

      setTower((prev) => ({ ...prev, gradient: result }));
    } finally {
      return;
    }
  };

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

      const countdownCanvas = countdownCanvasRef.current!;
      const countdownCtx = countdownCanvas.getContext("2d");

      const getDetectResults = async (video: HTMLVideoElement) => {
        let lastVideoTime = -1;
        let startTimeMs = performance.now();

        if (lastVideoTime !== video.currentTime) {
          lastVideoTime = video.currentTime;
          return handLandmarkerRef.current!.detectForVideo(video, startTimeMs);
        }
      };

      countdownAnimate(countdownCtx);

      const draw = async () => {
        const results = await getDetectResults(videoRef.current!);
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

        if (results?.landmarks) {
          results.landmarks.forEach((landmarks: any) => {
            drawLandmarks(ctx, landmarks, { color: "#cc0000", lineWidth: 2 });
            drawConnectors(ctx, landmarks, HandLandmarker.HAND_CONNECTIONS, {
              color: "#ff6600",
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
      cancelAnimationFrame(countdownAnimateIdRef.current!);
      canvasRef
        .current!.getContext("2d")!
        .clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    };
  }, [predicting]);

  return (
    <div className="u-flex">
      <div className="Creation-cameraContainer u-flexColumn  noto-sans">
        <div className="Creation-paddingDiv">
          <div className="Creation-videoContainer">
            <video className="Creation-video" ref={videoRef} autoPlay playsInline />
            <canvas className="Creation-canvas" ref={canvasRef} />
            <canvas className="Creation-countdownCanvas" ref={countdownCanvasRef} />
          </div>
          <div className="Creation-optionsContainer">
            <div className="Creation-controls">
              <h3 className="Creation-title">Controls</h3>
              <hr className="Creation-line" />
              <div className="Creation-button" onClick={handleCam}>
                <p style={{ padding: 24 }}>{camRunning ? "Close Webcam" : "Open Webcam"}</p>
              </div>
              <div className="Creation-button" onClick={handlePredict}>
                <p style={{ padding: 24 }}>{predicting ? "Stop Prediction" : "Start Prediction"}</p>
              </div>
            </div>
            <div className="Creation-properties">
              <h3 className="Creation-title">Properties</h3>
              <hr className="Creation-line" />
              <div className="Creation-propControl u-flex">
                <div className="Creation-propControl-text">Radius</div>
                <input
                  type="range"
                  value={tower.radius}
                  min={0}
                  max={1.4}
                  step={0.05}
                  onChange={(e) => {
                    setTower({ ...tower, radius: parseFloat(e.target.value) });
                  }}
                />
              </div>
              <div className="Creation-propControl u-flex">
                <div className="Creation-propControl-text">Gradient</div>
                <input
                  type="range"
                  value={tower.gradient}
                  min={1}
                  max={7}
                  step={0.25}
                  onChange={(e) => {
                    setTower({ ...tower, gradient: parseFloat(e.target.value) });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Creation-canvasContainer u-flexColumn">
        <TowerAdjustable tower={tower} canvas={{ width: 700, height: 700 }} />
      </div>
      <div className="Creation-buttonContainer">
        <div className="Creation-button" onClick={handleSave}>
          <p style={{ padding: 24 }}>Save</p>
        </div>
      </div>
    </div>
  );
};

export default Creation;
