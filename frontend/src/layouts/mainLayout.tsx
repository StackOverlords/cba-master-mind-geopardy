import { Outlet } from "react-router";
import GradientBackground from "../components/ui/gradientBackground";
import Header from "../components/header";

const MainLayout = () => {
    return (
        <>
            <GradientBackground />
            <Header />
            <Outlet />
        </>
    );
}

export default MainLayout;