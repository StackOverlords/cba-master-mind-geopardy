import { useEffect, useRef } from "react";

const useSound = (url: string) => {
	const audio = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		const newAudio = new Audio(url);
		newAudio.preload = "auto"; // 👈 Esto fuerza la precarga
		audio.current = newAudio;
	}, [url]);

	const play = (playFromLastSeconds?: number) => {
		if (!audio.current) return;

		const tryPlay = () => {
			audio.current!.play().catch((err) => {
				console.log("Audio play error:", err);
			});
		};

		if (playFromLastSeconds) {
			if (audio.current.readyState >= 1) {
				// metadata ya disponible
				const startTime = Math.max(audio.current.duration - playFromLastSeconds, 0);
				audio.current.currentTime = startTime;
				tryPlay();
			} else {
				// espera a que esté disponible
				audio.current.addEventListener("loadedmetadata", () => {
					const startTime = Math.max(audio.current!.duration - playFromLastSeconds, 0);
					audio.current!.currentTime = startTime;
					tryPlay();
				}, { once: true });
			}
		} else {
			audio.current.currentTime = 0;
			tryPlay();
		}
	};

	return {
		play,
		stop: () => {
			if (audio.current) {
				audio.current.pause();
				audio.current.currentTime = 0;
			}
		},
	};
};

export default useSound;
