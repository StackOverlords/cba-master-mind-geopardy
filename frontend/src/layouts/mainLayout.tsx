import { Outlet } from "react-router";
import GradientBackground from "../components/ui/gradientBackground";

const MainLayout = () => {
    return (
        <>
            <GradientBackground />
            <Outlet />
        </>
    );
}

export default MainLayout;