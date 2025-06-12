import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, BookOpen, Code, Lightbulb } from "lucide-react";
import paola from "../assets/teachers/one.webp";
import claudia from "../assets/teachers/two.webp";
import BackButton from "../components/ui/backButton";
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

type Teacher = {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  avatar?: string;
};

const TeamPage = () => {
  const teachers: Teacher[] = [
    {
      name: "Claudia Andrade Serrano",
      role: "Co-creator & English Teacher",
      bio: "Master Mind Jeopardy co-creator. English teacher and teacher trainer at CBA Tarija.",
      linkedin: "https://linkedin.com/in/claudia-griselda-andrade-serrano-152764238",
      avatar: paola, // Using paola's avatar for Claudia
    },
    {
      name: "Paola Andrea Ortega",
      role: "Co-creator & Language Teacher",
      bio: "Master Mind Jeopardy co-creator. English and French teacher. TESOL certified educator. Teacher trainer.",
      linkedin: "https://www.linkedin.com/in/paola-andrea-ortega-barriga-45109717b",
      avatar: claudia
    }
  ];

  const teamMembers = [
    {
      name: "Olivio Subelza",
      role: "Developer",
      github: "olivio-git",
      linkedin: "https://www.linkedin.com/in/olivio-subelza-cabezas/",
    },
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
      name: "Roger León",
      role: "Project Manager & Developer",
      github: "rogerleon",
      linkedin: "https://www.linkedin.com/in/rhleone/",
    },
  ];

  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
              bio: data.bio || "Passionate developer contributing to Master Mind CBA",
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
              bio: "Passionate developer contributing to Master Mind CBA",
              login: member.github,
              fetched: false,
            };
          }
        })
      );
      setDevelopers(results);
      setLoading(false);
    };

    fetchDevelopers();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden backdrop-blur-sm">
      {/* Background with gradients and subtle lights */}
      <BackButton handleCleanGame={() => { }} text="Back to home" href="/" className="left-4 top-4" />
      <div className="fixed inset-0 pointer-events-none z-0 ">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-600/8 rounded-full blur-3xl animate-blob opacity-60"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-600/8 rounded-full blur-3xl animate-blob delay-1000 opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/3 rounded-full blur-3xl animate-blob delay-2000 opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16" // Reducido mb
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-poppins mb-3 sm:mb-4 text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text  leading-tight">
            Master Mind CBA
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-2 sm:px-0">
            An innovative educational project born from the collaboration between passionate English teachers
            and talented developers at CBA Tarija. Experience learning through gamification.
          </p>
        </motion.div>

        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-12 sm:mb-16" // Reducido mb
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 sm:p-7 border border-white/10 shadow-lg shadow-white/5">
            <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-white mb-5 sm:mb-6 text-center bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text ">About the Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold font-poppins text-teal-300 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-teal-400" />
                  Educational Vision
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Master Mind CBA transforms traditional learning into an engaging, interactive experience.
                  Inspired by the classic Jeopardy format, our game challenges students with questions about general knowledge, making learning both fun and competitive.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold font-poppins text-cyan-300 flex items-center gap-2">
                  <Code className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
                  Technical Innovation
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Built with modern web technologies, our platform features real-time multiplayer capabilities,
                  adaptive difficulty levels, comprehensive analytics, and an intuitive user interface that
                  makes learning accessible and enjoyable for students of all ages.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Teachers Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-12 sm:mb-16" // Reducido mb
        >
          <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-white mb-7 sm:mb-9 text-center bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text ">Project Creators</h2> {/* Ajuste de tamaño de texto y mb */}
          <p className="text-base sm:text-lg text-gray-300 text-center mb-7 sm:mb-9 max-w-2xl mx-auto font-light px-2 sm:px-0">
            The visionary educators who conceived and designed the Master Mind experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 max-w-4xl mx-auto">
            {teachers.map((teacher, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.15, duration: 0.6 }}
                className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-blue-600/50 shadow-md">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold font-poppins text-white mb-1 leading-tight truncate">
                      {teacher.name}
                    </h3>
                    <p className="text-sm sm:text-base text-purple-300 font-medium mb-2">
                      {teacher.role}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3 sm:mb-4">
                      {teacher.bio}
                    </p>
                    <a
                      href={teacher.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors bg-white/5 px-2 py-1 rounded-full font-medium text-xs border border-blue-500/20 hover:bg-white/10"
                    >
                      <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Connect on LinkedIn</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Developers Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mb-12 sm:mb-16" // Reducido mb
        >
          <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-white mb-7 sm:mb-9 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text ">Development Team</h2> {/* Ajuste de tamaño de texto y mb */}
          <p className="text-base sm:text-lg text-gray-300 text-center mb-7 sm:mb-9 max-w-2xl mx-auto font-light px-2 sm:px-0">
            The skilled developers who brought the vision to life through code and innovation.
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 max-w-4xl mx-auto">
              {[...Array(teamMembers.length)].map((_, index) => (
                <div key={index} className="bg-white/8 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10 animate-pulse">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                    <div className="w-16 h-16 rounded-full bg-gray-700"></div> {/* Skeleton circular */}
                    <div className="flex-1 space-y-2"> {/* Reducido espacio */}
                      <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3.5 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-3.5 bg-gray-700 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-7 max-w-4xl mx-auto">
              {developers.map((dev, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white/20 shadow-md">
                      {dev.avatar ? (
                        <img
                          src={dev.avatar}
                          alt={dev.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-2xl font-bold">{dev.name[0]}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold font-poppins text-white mb-1 leading-tight truncate">
                        {dev.name || dev.login}
                      </h3>
                      <p className="text-sm sm:text-base text-green-300 font-medium">
                        {dev.role}
                      </p>
                      {/* <span
                        className="bg-purple-500/20 text-purple-300 border-purple-400/40 text-[10px] px-2 py-0.5 rounded-full border w-max h-max"
                      >
                        {dev.login}
                      </span> */}
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mt-2 mb-3 sm:mb-4">
                        {dev.bio || "Passionate developer contributing to Master Mind CBA"}
                      </p>
                      <div className="flex justify-center sm:justify-start gap-1.5"> {/* Reducido gap */}
                        {dev.github && (
                          <a
                            href={dev.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors p-1.5 rounded-full bg-white/5 hover:bg-white/10"
                          >
                            <Github className="w-4 h-4" />
                            <span className="text-xs">
                              {dev.login}
                            </span>
                          </a>
                        )}
                        {dev.linkedin && (
                          <a
                            href={dev.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors p-1.5 rounded-full bg-white/5 hover:bg-white/10"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      {!dev.fetched && (
                        <p className="text-xs text-yellow-400 mt-2 text-center sm:text-left">
                          (Using fallback data for GitHub profile)
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-12 sm:mt-16" // Reducido mt
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 sm:p-7 border border-white/10 shadow-lg shadow-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-2 sm:mb-3 text-gray-400 gap-1.5 sm:gap-2"> {/* Reducido mb y gap */}
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-0 sm:mr-1.5 text-yellow-400" />
              <p className="text-sm sm:text-base font-light">
                © {new Date().getFullYear()} Master Mind CBA Team. All rights reserved.
              </p>
            </div>
            <p className="text-xs text-gray-500 font-light"> {/* Mantenido text-xs para que sea más pequeño */}
              Version 2.0.0 | Built with passion in Tarija, Bolivia 🇧🇴
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamPage;