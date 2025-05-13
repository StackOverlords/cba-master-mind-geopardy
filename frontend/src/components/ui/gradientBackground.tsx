const GradientBackground = () => {
    return (
        <div className="fixed
         top-0 
         -z-10 
         h-screen w-screen 
         overflow-hidden 
         bg-[#0b0e14]">
            <div className="absolute inset-0 bg-linear-to-br from-purple-900/10 to-blue-900/10 blur-[100px]"></div>
            <div className="absolute -top-2/12 -left-1/12 w-lg h-[512px] bg-linear-to-br from-purple-900/30 to-transparent rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-2/12 -right-1/12 w-lg h-[512px] bg-linear-to-tl from-blue-900/30 to-transparent rounded-full blur-[100px]"></div>
            <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>

            <div className="absolute top-[15%] left-[10%] w-6 h-6 border border-blue-500/30 rotate-45 bg-radial to-purple-900/20 from-transparent shadow-md shadow-purple-900/30"></div>
            <div className="absolute top-[25%] left-[5%] w-4 h-4 border border-blue-500/20 rotate-12 bg-radial to-purple-900/20 from-transparent shadow-md shadow-purple-900/30"></div>
            <div className="absolute top-[65%] left-[10%] w-4 h-4 border border-blue-500/20 rotate-12 bg-radial to-purple-900/20 from-transparent shadow-md shadow-purple-900/30"></div>
            <div className="absolute top-[10%] right-[20%] w-5 h-5 border border-purple-500/30 rotate-45 bg-radial to-purple-900/20 from-transparent shadow-md shadow-purple-900/30"></div>
            <div className="absolute bottom-[30%] right-[10%] w-6 h-6 border border-purple-500/20 rotate-12 bg-radial to-purple-900/20 from-transparent shadow-md shadow-purple-900/30"></div>
            <div className="absolute bottom-[15%] right-[15%] w-4 h-4 border border-purple-500/20 rotate-45 bg-radial to-purple-900/20 from-transparent shadow-md shadow-purple-900/30"></div>
        </div>
    );
}

export default GradientBackground;