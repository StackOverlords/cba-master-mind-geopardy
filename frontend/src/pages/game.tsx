import GameBoard from "../components/game/gameBoard";
import Leaderboard from "../components/game/leaderboard/leaderboard";
import { allTimeLeaderboardData, monthlyLeaderboardData } from "../services/leaderboardData";

const Game = () => {
    return (
        <main className=" min-h-screen flex justify-center py-10 flex-wrap">
            <div className="">
                <GameBoard />
            </div>
            <section className="">
                <div className="p-4 flex items-center justify-center">
                    <div className="container mx-auto flex flex-col items-center">
                        <Leaderboard
                            monthlyData={monthlyLeaderboardData}
                            allTimeData={allTimeLeaderboardData}
                        />
                    </div>
                </div>

            </section>
            
        </main>
    );
}

export default Game;