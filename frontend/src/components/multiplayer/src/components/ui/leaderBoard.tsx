import React from "react";
import { Crown, Trophy, Medal, Star, Zap, Target, ArrowLeft } from "lucide-react";

interface Player {
  userId: string;
  username: string;
  score: number;
}

interface Ranking {
  playerId: string;
  score: number;
}

interface LeaderboardData {
  ranking: Ranking[];
  playersScores: Player[];
}

interface LeaderboardProps {
  data: LeaderboardData;
}

const TopThreeCard = ({
  player,
  position,
  score,
}: {
  player: Player;
  position: number;
  score: number;
}) => {
  const getPositionStyles = (pos: number) => {
    switch (pos) {
      case 1:
        return {
          podiumColor: "bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-300",
          height: "h-20 sm:h-24 md:h-32 lg:h-36",
          avatarBg: "bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500",
          textColor: "text-amber-900",
          glowColor: "shadow-amber-400/50",
          icon: <Crown className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-amber-200" />,
          iconBg: "bg-amber-500/20",
        };
      case 2:
        return {
          podiumColor: "bg-gradient-to-t from-slate-400 via-gray-300 to-slate-200",
          height: "h-16 sm:h-20 md:h-24 lg:h-28",
          avatarBg: "bg-gradient-to-br from-slate-300 via-gray-300 to-slate-400",
          textColor: "text-slate-800",
          glowColor: "shadow-slate-400/50",
          icon: <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-slate-600" />,
          iconBg: "bg-slate-500/20",
        };
      case 3:
        return {
          podiumColor: "bg-gradient-to-t from-orange-600 via-orange-500 to-orange-400",
          height: "h-14 sm:h-16 md:h-20 lg:h-24",
          avatarBg: "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600",
          textColor: "text-orange-900",
          glowColor: "shadow-orange-400/50",
          icon: <Medal className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-orange-200" />,
          iconBg: "bg-orange-500/20",
        };
      default:
        return {
          podiumColor: "bg-gradient-to-t from-indigo-500 to-indigo-400",
          height: "h-12 sm:h-16 md:h-20",
          avatarBg: "bg-gradient-to-br from-indigo-400 to-indigo-500",
          textColor: "text-indigo-900",
          glowColor: "shadow-indigo-400/50",
          icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-indigo-200" />,
          iconBg: "bg-indigo-500/20",
        };
    }
  };

  const styles = getPositionStyles(position);

  return (
    <div
      className={`flex flex-col items-center ${
        position === 1 ? "order-2" : position === 2 ? "order-1" : "order-3"
      } transform transition-all duration-500 hover:scale-105`}
    >
      {/* Crown/Trophy Icon */}
      <div className={`${styles.iconBg} rounded-full p-2 sm:p-3 mb-1 sm:mb-2 backdrop-blur-sm`}>
        {styles.icon}
      </div>

      {/* Avatar */}
      <div className="relative mb-2 sm:mb-4">
        <div
          className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 ${styles.avatarBg} rounded-full flex items-center justify-center ${styles.glowColor} shadow-2xl relative z-10 border-2 sm:border-4 border-white/20`}
        >
          <span className="text-white font-bold text-sm sm:text-lg md:text-2xl lg:text-3xl drop-shadow-lg">
            {player.username.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Floating particles for first place */}
        {position === 1 && (
          <>
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full animate-bounce opacity-80"></div>
            <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-pulse opacity-60"></div>
          </>
        )}
      </div>

      {/* Player Info Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 mb-2 sm:mb-4 border border-white/20 shadow-xl">
        <div className="text-white font-bold text-xs sm:text-sm md:text-lg mb-1 text-center truncate max-w-20 sm:max-w-24 md:max-w-none">
          {player.username}
        </div>
        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          <span className="text-white font-extrabold text-sm sm:text-lg md:text-xl">{score}</span>
          <span className="text-white/70 text-xs sm:text-sm">pts</span>
        </div>
      </div>

      {/* Enhanced Podium */}
      <div
        className={`${styles.podiumColor} ${styles.height} w-16 sm:w-20 md:w-24 lg:w-28 rounded-t-xl sm:rounded-t-2xl flex items-center justify-center shadow-2xl relative overflow-hidden border-t-2 sm:border-t-4 border-white/30`}
      >
        <span className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black ${styles.textColor} drop-shadow-lg`}>
          {position}
        </span>

        {/* Multiple shine effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 rounded-t-xl sm:rounded-t-2xl"></div>
        <div className="absolute top-0 left-1/4 w-1/2 h-0.5 sm:h-1 bg-white/60 rounded-full"></div>
        
        {/* Side decorations */}
        <div className="absolute -left-0.5 sm:-left-1 top-2 sm:top-4 w-1 sm:w-2 h-4 sm:h-8 bg-white/20 rounded-r-full"></div>
        <div className="absolute -right-0.5 sm:-right-1 top-2 sm:top-4 w-1 sm:w-2 h-4 sm:h-8 bg-white/20 rounded-l-full"></div>
      </div>
    </div>
  );
};

const LeaderboardRow = ({
  player,
  position,
  score,
}: {
  player: Player;
  position: number;
  score: number;
}) => {
  const getRowStyles = (pos: number) => {
    const colorSets = [
      {
        avatar: "bg-gradient-to-br from-emerald-500 to-teal-600",
        accent: "text-emerald-400",
        glow: "shadow-emerald-500/20",
        border: "border-emerald-500/30"
      },
      {
        avatar: "bg-gradient-to-br from-blue-500 to-indigo-600",
        accent: "text-blue-400",
        glow: "shadow-blue-500/20",
        border: "border-blue-500/30"
      },
      {
        avatar: "bg-gradient-to-br from-purple-500 to-violet-600",
        accent: "text-purple-400",
        glow: "shadow-purple-500/20",
        border: "border-purple-500/30"
      },
      {
        avatar: "bg-gradient-to-br from-pink-500 to-rose-600",
        accent: "text-pink-400",
        glow: "shadow-pink-500/20",
        border: "border-pink-500/30"
      },
      {
        avatar: "bg-gradient-to-br from-orange-500 to-red-600",
        accent: "text-orange-400",
        glow: "shadow-orange-500/20",
        border: "border-orange-500/30"
      },
      {
        avatar: "bg-gradient-to-br from-cyan-500 to-blue-600",
        accent: "text-cyan-400",
        glow: "shadow-cyan-500/20",
        border: "border-cyan-500/30"
      },
      {
        avatar: "bg-gradient-to-br from-lime-500 to-green-600",
        accent: "text-lime-400",
        glow: "shadow-lime-500/20",
        border: "border-lime-500/30"
      },
      {
        avatar: "bg-gradient-to-br from-yellow-500 to-orange-600",
        accent: "text-yellow-400",
        glow: "shadow-yellow-500/20",
        border: "border-yellow-500/30"
      },
    ];
    return colorSets[(pos - 4) % colorSets.length] || colorSets[0];
  };

  const styles = getRowStyles(position);

  return (
    <div className={`group flex items-center justify-between bg-slate-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 mb-2 sm:mb-3 md:mb-4 border ${styles.border} hover:bg-slate-700/80 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${styles.glow} hover:shadow-xl`}>
      <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
        {/* Position Badge */}
        <div className="relative">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-lg border border-slate-500/50">
            {position}
          </div>
          <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-slate-500 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Avatar */}
        <div className="relative">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 ${styles.avatar} rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110 border-2 border-white/20`}
          >
            <span className="text-white font-bold text-sm sm:text-lg md:text-2xl drop-shadow-lg">
              {player.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${styles.avatar} rounded-full border-2 border-slate-800 flex items-center justify-center`}>
            <Target className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white" />
          </div>
        </div>

        {/* Player Info */}
        <div className="flex flex-col min-w-0">
          <span className="text-white font-bold text-sm sm:text-lg md:text-xl mb-0.5 sm:mb-1 truncate">
            {player.username}
          </span>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-slate-400 text-xs sm:text-sm font-medium">
              Rank #{position}
            </span>
          </div>
        </div>
      </div>

      {/* Score Section */}
      <div className="flex flex-col items-end">
        <div className="flex items-center space-x-1 sm:space-x-2 mb-0.5 sm:mb-1">
          <Star className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${styles.accent}`} />
          <span className={`${styles.accent} font-black text-lg sm:text-xl md:text-2xl`}>{score}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-slate-500 text-xs sm:text-sm">of</span>
          <span className="text-slate-400 text-xs sm:text-sm font-semibold">100 pts</span>
        </div>
      </div>
    </div>
  );
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  // Combine rankings with player data and sort by score
  console.log("Leaderboard data:", data);
  const combinedData = data.ranking
    .map((ranking) => {
      const player = data.playersScores.find(
        (p) => p.userId === ranking.playerId
      );
      return player ? { ...player, score: ranking.score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score);

  const topThree = combinedData.slice(0, 3);
  const remaining = combinedData.slice(3);

  // Función para volver al inicio y limpiar historial
  const handleBackToHome = () => {
    // Reemplazar la ruta actual por la de inicio en el historial
    window.history.replaceState(null, '', '/');
    // Redireccionar al inicio
    sessionStorage.removeItem("gameCode");
    window.location.href = '/';
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden flex flex-col">
      {/* Botón Volver al Inicio */}
      <button 
        onClick={handleBackToHome}
        className="absolute top-4 left-4 z-20 bg-indigo-900/80 hover:bg-indigo-800/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center justify-center shadow-lg border border-indigo-400/20 transition-all duration-300 group"
      >
        <span className="text-white font-bold text-sm sm:text-base flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </span>
      </button>

      {/* Contador flotante */}
      <div className="absolute top-4 right-4 z-20 bg-indigo-900/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center justify-center shadow-lg border border-indigo-400/20">
        <span className="text-white font-bold text-sm sm:text-base">
          Players: {combinedData.length}
        </span>
      </div>

      {/* Resto del componente permanece igual */}
      {/* Enhanced cosmic background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated stars - reduced for mobile performance */}
        {[...Array(window.innerWidth < 768 ? 50 : 150)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${Math.random() * 4 + 1}px rgba(255,255,255,0.8)`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 2}s`,
            }}
          />
        ))}
        
        {/* Floating orbs - reduced for mobile */}
        {[...Array(window.innerWidth < 768 ? 3 : 6)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full opacity-10 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][i % 5]} 0%, transparent 70%)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 8 + 6}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-indigo-900/40"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-900/20 to-slate-900/60"></div>

      {/* Header - Fixed */}
      <div className="relative z-10 flex-shrink-0 text-center py-4 sm:py-6 md:py-8 px-4">
        <div className="inline-flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl">
            <Trophy className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
            Leaderboard
          </h1>
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl">
            <Crown className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
          </div>
        </div>
        <p className="text-slate-300 text-sm sm:text-lg md:text-xl lg:text-2xl font-medium mb-2 sm:mb-4">
          Champions of Excellence
        </p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 sm:w-12 md:w-16 h-0.5 bg-gradient-to-r from-transparent to-yellow-400"></div>
          <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400" />
          <div className="w-8 sm:w-12 md:w-16 h-0.5 bg-gradient-to-l from-transparent to-yellow-400"></div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 md:px-8">
        <div className="pb-4 sm:pb-6 md:pb-8">
          {/* Top 3 Podium Section */}
          <div className="flex justify-center items-end space-x-2 sm:space-x-4 md:space-x-8 lg:space-x-12 mb-8 sm:mb-16 md:mb-24 lg:mb-32 pt-4 sm:pt-8 md:pt-12">
            {topThree.map((player, index) => (
              <TopThreeCard
                key={player!.userId}
                player={player!}
                position={index + 1}
                score={player!.score}
              />
            ))}
          </div>

          {/* Remaining Rankings */}
          {remaining.length > 0 && (
            <div className="max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-8 md:mb-12">
                <div className="w-4 sm:w-6 md:w-8 h-0.5 bg-gradient-to-r from-transparent to-slate-400"></div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                  Hall of Fame
                </h2>
                <div className="w-4 sm:w-6 md:w-8 h-0.5 bg-gradient-to-l from-transparent to-slate-400"></div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                {remaining.map((player, index) => (
                  <LeaderboardRow
                    key={player!.userId}
                    player={player!}
                    position={index + 4}
                    score={player!.score}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};