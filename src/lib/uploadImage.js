import { api } from "./api";

export const MAX_IMAGE_MB = 5;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Returns an error message for an unusable file, or null when it's fine. */
export const validateImage = (file) => {
  if (!file) return "Choose an image to upload.";
  if (!IMAGE_TYPES.includes(file.type)) return "Use a JPG, PNG or WebP image.";
  if (file.size > MAX_IMAGE_MB * 1024 * 1024)
    return `The image must be ${MAX_IMAGE_MB} MB or smaller.`;
  return null;
};

/**
 * Uploads an image to Cloudinary and resolves with its https URL.
 * The server signs the request (the API secret never reaches the browser);
 * the file itself goes straight from the browser to Cloudinary.
 */
export async function uploadImage(file) {
  const problem = validateImage(file);
  if (problem) throw new Error(problem);

  const sig = await api.post("/uploads/signature");
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sig.apiKey);
  body.append("timestamp", sig.timestamp);
  body.append("folder", sig.folder);
  body.append("signature", sig.signature);

  let res;
  try {
    res = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      { method: "POST", body },
    );
  } catch {
    throw new Error("The upload failed. Check your connection and try again.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.secure_url) {
    throw new Error(
      data?.error?.message || "The upload failed. Please try again.",
    );
  }
  return data.secure_url;
}

/** Cloudinary serves a small, cropped, optimised copy when asked in the URL. */
export const optimizedImage = (url, size) => {
  if (
    !url ||
    !url.includes("res.cloudinary.com") ||
    !url.includes("/image/upload/")
  )
    return url;
  const px = Math.round(size * 2);
  return url.replace(
    "/image/upload/",
    `/image/upload/c_fill,g_auto,w_${px},h_${px},f_auto,q_auto/`,
  );
};