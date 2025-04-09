// src/lib/middleware/multer.js
import multer from "multer";

export const upload = multer({ storage: multer.memoryStorage() });

export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}
