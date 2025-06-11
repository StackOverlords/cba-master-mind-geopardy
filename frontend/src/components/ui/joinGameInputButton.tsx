import { useEffect, useState } from "react";
import { socketService } from "../../services/socketService"; 

interface JoinGameInputButtonProps {
  label: string;
  description: string;
  icon: string;
  // onSubmit: (code: string) => void;
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
      socketService.on("gameJoined", () => { 
        if (code && setGameCode) {
          setGameCode(code); // Llama a setGameCode con el código del juego
          if (setDeactivatedButtonStart) {
            setDeactivatedButtonStart(true); // Asegúrate de que setDeactivatedButtonStart esté definido
          }
          socketService.emit("getGameState", code);
        }
      }); 
    }
  }, [code, userId]);
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="w-full p-6 rounded-xl bg-dashboard-bg/50 border-2 border-dashboard-border/50 hover:border-dashboard-border/70 transition-all duration-200 shadow-sm">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">{icon}</span>
            <div>
              <h3 className="text-white font-semibold text-lg">{label}</h3>
              <p className="text-slate-400 text-sm mt-1">{description}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                className={`w-full px-5 py-4 text-lg border-2 rounded-lg focus:ring-2 transition-all text-gray-400 placeholder-gray-400 bg-gray-800/50 shadow-sm ${
                  isValid
                    ? "border-gray-700 focus:border-blue-500 focus:ring-blue-200"
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
              className="px-6 py-4 bg-dashboard-border/80 hover:bg-dashboard-border text-white font-medium rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
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
