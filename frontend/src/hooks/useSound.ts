import { useEffect, useRef } from "react";

const useSound = (url: string, playFromLastSeconds?: number) => {
	const audio = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		audio.current = new Audio(url);
	}, [url]);

	return {
		play: () => {
			if (audio.current) {
				if (playFromLastSeconds && audio.current.duration) {
					const startTime = Math.max(audio.current.duration - playFromLastSeconds, 0);
					audio.current.currentTime = startTime;
				} else {
					audio.current.currentTime = 0;
				}
				audio.current
					.play()
					.catch((err) => console.log("Audio play error:", err));
			}
		},
		stop: () => {
			if (audio.current) {
				audio.current.pause();
				audio.current.currentTime = 0;
			}
		},
	};
};
export default useSound;