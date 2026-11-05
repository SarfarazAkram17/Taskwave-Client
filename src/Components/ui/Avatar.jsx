import { useState } from "react";
import { initials } from "../../lib/format";
import { optimizedImage } from "../../lib/uploadImage";

const Avatar = ({ name, src, size = 36, className = "" }) => {
  const [failed, setFailed] = useState(false);
  const style = {
    width: size,
    height: size,
    fontSize: Math.max(11, size * 0.38),
  };
  if (src && !failed) {
    return (
      <img
        src={optimizedImage(src, size)}
        alt=""
        onError={() => setFailed(true)}
        referrerPolicy="no-referrer"
        className={`rounded-full object-cover shrink-0 bg-surface-2 ${className}`}
        style={style}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={style}
      className={`inline-flex items-center justify-center rounded-full shrink-0 bg-primary-soft text-primary font-semibold ${className}`}
    >
      {initials(name)}
    </span>
  );
};

export default Avatar;