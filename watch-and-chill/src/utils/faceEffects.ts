import type { FaceLandmarkerResult, NormalizedLandmark } from '@mediapipe/tasks-vision';

export type FaceEffect = {
  id: string;
  label: string;
  icon: string;
};

export const FACE_EFFECTS: FaceEffect[] = [
  { id: 'dog', label: 'Piesek', icon: '🐶' },
  { id: 'crown', label: 'Korona', icon: '👑' },
  { id: 'glasses', label: 'Okulary', icon: '🕶️' },
];

// Indices into MediaPipe's 478-point face mesh — stable landmark IDs
// documented by the face_landmarker model, not something we compute.
const FOREHEAD_TOP = 10;
const LEFT_TEMPLE = 127;
const RIGHT_TEMPLE = 356;
const NOSE_TIP = 1;
const LEFT_EYE_OUTER = 33;
const RIGHT_EYE_OUTER = 263;

function toPoint(landmark: NormalizedLandmark, width: number, height: number) {
  return { x: landmark.x * width, y: landmark.y * height };
}

export function drawFaceEffect(
  ctx: CanvasRenderingContext2D,
  result: FaceLandmarkerResult,
  effectId: string,
  width: number,
  height: number
) {
  const landmarks = result.faceLandmarks?.[0];
  if (!landmarks) return;

  const leftTemple = toPoint(landmarks[LEFT_TEMPLE], width, height);
  const rightTemple = toPoint(landmarks[RIGHT_TEMPLE], width, height);
  const faceWidth = Math.hypot(rightTemple.x - leftTemple.x, rightTemple.y - leftTemple.y);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (effectId === 'dog') {
    const nose = toPoint(landmarks[NOSE_TIP], width, height);
    const earSize = faceWidth * 0.55;
    ctx.font = `${earSize}px sans-serif`;
    ctx.fillText('🐶', leftTemple.x - faceWidth * 0.18, leftTemple.y - faceWidth * 0.32);
    ctx.fillText('🐶', rightTemple.x + faceWidth * 0.18, rightTemple.y - faceWidth * 0.32);
    ctx.font = `${faceWidth * 0.3}px sans-serif`;
    ctx.fillText('👃', nose.x, nose.y);
  } else if (effectId === 'crown') {
    const forehead = toPoint(landmarks[FOREHEAD_TOP], width, height);
    const size = faceWidth * 0.9;
    ctx.font = `${size}px sans-serif`;
    ctx.fillText('👑', forehead.x, forehead.y - size * 0.55);
  } else if (effectId === 'glasses') {
    const leftEye = toPoint(landmarks[LEFT_EYE_OUTER], width, height);
    const rightEye = toPoint(landmarks[RIGHT_EYE_OUTER], width, height);
    const centerX = (leftEye.x + rightEye.x) / 2;
    const centerY = (leftEye.y + rightEye.y) / 2;
    const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
    const size = faceWidth * 1.1;
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.font = `${size}px sans-serif`;
    ctx.fillText('🕶️', 0, 0);
    ctx.rotate(-angle);
    ctx.translate(-centerX, -centerY);
  }

  ctx.restore();
}
