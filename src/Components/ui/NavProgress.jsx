import { useNavigation } from "react-router";

/** Thin progress bar while a lazy route is loading. */
const NavProgress = () => {
  const { state } = useNavigation();
  if (state === "idle") return null;
  return (
    <div className="fixed top-0 inset-x-0 h-0.5 z-[100] overflow-hidden" role="progressbar" aria-label="Loading page">
      <div className="h-full w-1/3 bg-primary rounded-full" style={{ animation: "slide 1s ease-in-out infinite" }} />
      <style>{`@keyframes slide{from{transform:translateX(-100%)}to{transform:translateX(300%)}}`}</style>
    </div>
  );
};

export default NavProgress;
