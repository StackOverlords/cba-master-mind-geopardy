import { useEffect, useState } from "react";
import { motion } from "motion/react";
import ModalContainer from "../ui/modalContainer";
import { GithubIcon, LinkedinIcon } from "lucide-react";

type Developer = {
  name: string;
  role: string;
  avatar?: string;
  github?: string;
  linkedin?: string;
  login?: string;
  bio?: string;
  fetched: boolean;
};

type HelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const teamMembers = [
    {
      name: "Ronald Gallardo Arce",
      role: "Developer",
      github: "ronaldgallardoarce",
      linkedin: "https://www.linkedin.com/in/ronald-gallardo-arce-a01b53279/",
    },
    {
      name: "Limber Tolaba",
      role: "Developer",
      github: "limber-git",
      linkedin: "https://www.linkedin.com/in/limber--tolaba/",
    },
    {
      name: "Olivio Subelza",
      role: "Developer",
      github: "olivio-git",
      linkedin: "https://www.linkedin.com/in/olivio-subelza-cabezas/",
    },
    {
      name: "Roger León",
      role: "Project Manager",
      github: "rogerleon",
      linkedin: "https://www.linkedin.com/in/rhleone/",
    },
  ];

  const [developers, setDevelopers] = useState<Developer[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDevelopers = async () => {
      const results = await Promise.all(
        teamMembers.map(async (member) => {
          try {
            const res = await fetch(
              `https://api.github.com/users/${member.github}`
            );
            if (!res.ok) throw new Error("GitHub user not found");
            const data = await res.json();

            return {
              name: member.name || data.name || member.github,
              role: member.role,
              avatar: data.avatar_url,
              github: data.html_url,
              linkedin: member.linkedin,
              bio: data.bio,
              login: data.login,
              fetched: true,
            };
          } catch (err) {
            console.error(`Error fetching ${member.github}:`, err);
            return {
              name: member.name,
              role: member.role,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.github}`,
              github: `https://github.com/${member.github}`,
              linkedin: member.linkedin,
              bio: "",
              login: member.github,
              fetched: false,
            };
          }
        })
      );

      console.log("Fetched developers:", results); // Útil para debug
      setDevelopers(results);
    };

    fetchDevelopers();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalContainer handleCloseModal={onClose}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Master Mind CBA
          </h2>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">About the Game</h3>
          <p className="text-sm">
            Master Mind CBA is an interactive quiz game inspired by the classic
            Jeopardy format. Challenge yourself with questions about countries,
            capitals, landmarks, and more from around the world. Compete with
            friends or test your knowledge in solo mode to become a master!
          </p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-card/30 p-4 rounded-lg border border-border/50">
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>Multiple difficulty levels</li>
                <li>Real-time multiplayer</li>
                <li>Global leaderboards</li>
                <li>Custom categories</li>
                <li>Timed challenges</li>
              </ul>
            </div>
            <div className="bg-card/30 p-4 rounded-lg border border-border/50">
              <h4 className="font-medium mb-2">How to Play</h4>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>Select a category</li>
                <li>Choose question difficulty</li>
                <li>Answer correctly to earn points</li>
                <li>Use hints wisely</li>
                <li>Beat the timer for bonus points</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">
            Development Team
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {developers.map((dev, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-card/20 border border-border/50"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  {dev.avatar ? (
                    <img
                      src={dev.avatar}
                      alt={dev.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold">{dev.name[0]}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-medium text-sm">
                    {dev.login || dev.name}
                  </h4>
                  <p className="text-xs italic text-muted-foreground">
                    {dev.bio || "No bio available"}
                  </p>
                  {!dev.fetched && (
                    <p className="text-xs text-yellow-500">Fallback data</p>
                  )}
                  <div className="flex gap-2">
                    {dev.github && (
                      <a
                        href={dev.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GithubIcon className="size-5" />
                      </a>
                    )}
                    {dev.linkedin && (
                      <a
                        href={dev.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedinIcon className="size-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pt-4 text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Master Mind CBA Team. All rights
            reserved.
          </p>
          <p className="mt-1">Version 2.0.0</p>
        </div>
      </div>
    </ModalContainer>
  );
};

export default HelpModal;
