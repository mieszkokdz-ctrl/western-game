import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const WASM_BASE_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

// Loaded lazily (only once a face effect is actually selected) so people who
// never use them don't pay for the download on every visit.
export function getFaceLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
      return FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
      });
    })();
    landmarkerPromise.catch(() => {
      // Let the next call retry instead of permanently caching a failure —
      // a transient network hiccup shouldn't lock the feature off forever.
      landmarkerPromise = null;
    });
  }
  return landmarkerPromise;
}
