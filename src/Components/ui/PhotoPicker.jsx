import { useId, useRef, useState } from "react";
import { LuCamera, LuTrash2 } from "react-icons/lu";
import {
  IMAGE_TYPES,
  MAX_IMAGE_MB,
  validateImage,
} from "../../lib/uploadImage";
import Avatar from "./Avatar";
import { Spinner } from "./Feedback";

/**
 * Profile photo chooser. It never asks for a link: the person picks a file from their device.
 * `onSelect(file)` receives a validated image; the parent decides when to upload it.
 */
const PhotoPicker = ({
  name,
  src,
  busy = false,
  onSelect,
  onRemove,
  label = "Profile photo",
}) => {
  const id = useId();
  const input = useRef(null);
  const [error, setError] = useState("");

  const pick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again
    if (!file) return;
    const problem = validateImage(file);
    setError(problem || "");
    if (!problem) onSelect(file);
  };

  return (
    <div>
      <span className="label" id={`${id}-l`}>
        {label} <span className="text-faint font-normal">(optional)</span>
      </span>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative">
          <Avatar name={name} src={src} size={72} />
          {busy && (
            <span
              className="absolute inset-0 grid place-items-center rounded-full"
              style={{
                background: "color-mix(in srgb, var(--bg) 70%, transparent)",
              }}
            >
              <Spinner />
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={input}
            id={id}
            type="file"
            accept={IMAGE_TYPES.join(",")}
            className="sr-only"
            onChange={pick}
            disabled={busy}
            aria-labelledby={`${id}-l`}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => input.current?.click()}
            disabled={busy}
          >
            <LuCamera size={15} />
            {src ? "Change photo" : "Upload photo"}
          </button>
          {src && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onRemove}
              disabled={busy}
            >
              <LuTrash2 size={15} />
              Remove
            </button>
          )}
        </div>
      </div>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="hint">JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB.</p>
      )}
    </div>
  );
};

export default PhotoPicker;