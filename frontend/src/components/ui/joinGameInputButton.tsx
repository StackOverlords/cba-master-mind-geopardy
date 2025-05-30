import { useEffect, useState } from "react";
import { socketService } from "../../services/socketService";

interface JoinGameInputButtonProps {
  label: string;
  description: string;
  icon: string;
  onSubmit: (code: string) => void;
  placeholder?: string;
  buttonText?: string;
  userId?: string; // Añadido para el userId
  setGameCode?: (code: string) => void; // Añadido para setGameCode 
  gameState?:any;
  setDeactivatedButtonStart?: (deactivated: boolean) => void; // Añadido para setDeactivatedButtonStart
}

const JoinGameInputButton: React.FC<JoinGameInputButtonProps> = ({
  label,
  description,
  icon,
  onSubmit,
  placeholder = "Ejemplo: ABCD-1234",
  buttonText,
  userId,
  setGameCode, // Añadido para setGameCode
  setDeactivatedButtonStart
}) => {
  const [code, setCode] = useState("");
  const [isValid, setIsValid] = useState(true); // Nuevo estado para validación

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // Convertir a mayúsculas, ya que quiero que el código sea en mayúsculas
    setCode(value);
    setIsValid(value.length === 8 || value.length === 0); // Valida solo cuando hay input
    if (value.length === 8 || value.length === 0) {
      handleSubmit(e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code);
  };

  useEffect(() => {
    if (code.length === 8 && userId) {
      socketService.connect(userId);

      socketService.emit("joinGame", {
        gameCode: code,
        userData: {
          userId: userId, // Asegúrate de que el userId esté definido
        },
      });
      socketService.on("gameJoined", (data) => {
        console.log("Juego unido exitosamente:", data);
        if (code && setGameCode) {
          setGameCode(code); // Llama a setGameCode con el código del juego
          socketService.emit("getGameState", code);
          if (setDeactivatedButtonStart) {
            setDeactivatedButtonStart(true); // Asegúrate de que setDeactivatedButtonStart esté definido
          }
        }
      });
    }
  }, [code, userId]);
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="w-full p-6 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 shadow-sm">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">{icon}</span>
            <div>
              <h3 className="text-gray-800 font-semibold text-lg">{label}</h3>
              <p className="text-gray-500 text-sm mt-1">{description}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                className={`w-full px-5 py-4 text-lg border-2 rounded-lg focus:ring-2 transition-all text-gray-800 placeholder-gray-400 bg-white shadow-sm ${
                  isValid
                    ? "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    : "border-red-500 focus:border-red-500 focus:ring-red-200"
                }`}
                name="gameCode"
                placeholder={placeholder}
                autoComplete="off"
                maxLength={8} // Limita físicamente a 8 caracteres
              />
            </div>

            <button
              type="submit"
              disabled={!code.trim() || !isValid}
              className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default JoinGameInputButton;
