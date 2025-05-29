import { type ButtonHTMLAttributes } from "react";
import useSound from "../../hooks/useSound";
import keytypeSound from "../../assets/sounds/keytype.mp3";
// import keytypeSound from "../../assets/sounds/game-start-6104.mp3"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  handleOpenCreateGameModal?: () => void;
}

const PlayButton: React.FC<Props> = ({
  children,
  text = "Play now",
  className,
  handleOpenCreateGameModal, // ← Extraer la prop personalizada
  ...props // ← Ahora props solo contiene las props válidas de button
}) => {
  const { play, stop } = useSound(keytypeSound);

  const handleClick = () => {
    if (handleOpenCreateGameModal) {
      handleOpenCreateGameModal();
    }
    stop();
    play();
  };

  return (
    <button
      {...props}
      onClick={() => handleClick()}
      className={`
        gradient-btn
        bg-purple-700/10
        border-none
        rounded-[22px]
        shadow-xl
        text-gray-100
        cursor-pointer
        font-semibold
        text-2xl
        h-[84px]
        min-w-[230px]
        p-4
        relative
        transition-all
        duration-300
        ease-in-out
        transform
        -rotate-10
        skew-x-2 
        ${className}
      `}
    >
      <div className="fx"></div>
      <div className="fx bottom"></div>
      <div
        className="
        content-wrapper
        rounded-[20px]
        flex
        items-center
        justify-center
        gap-3.5
        absolute
        inset-0
        pb-[5px]
        transform
        translate-x-[6px]
        -translate-y-[8px]
        transition-all
        duration-300
        ease-in-out
        z-[3]
      "
      >
        {/* Light reflection element */}
        <div className="light-reflection"></div>
        <span
          className="flex items-center justify-center gap-3.5
          relative
          pointer-events-none
          select-none
          drop-shadow-md
        "
        >
          {children}
        </span>
        <svg
          viewBox="0 0 1200 1200"
          version="1.1"
          height="30"
          width="30"
          xmlns="http://www.w3.org/2000/svg"
          className="arrow-svg 
            relative
            pointer-events-none
            select-none
            drop-shadow-md
            transition-all
            duration-400
            ease-out
          "
        >
          <path fill="#e5e5e5" d="m150 550h775v100h-775z"></path>
          <path
            fill="#e5e5e5"
            d="m710 935-70-70 265-265-265-265 70-70 335 335z"
          ></path>
        </svg>
      </div>
    </button>
  );
};

export default PlayButton;
