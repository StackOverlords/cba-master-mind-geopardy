import { Route, Routes } from "react-router";
import MainLayout from "./layouts/mainLayout";
import LoginPage from "./pages/loginPage";
// import HomePage from "./pages/homePage";
import LoginForm from "./components/auth/loginForm";
import SignUpForm from "./components/auth/registerForm";
import LandingPage from "./pages/landingPage";
import { useEffect } from "react";
import { unsubscribeAuth } from "./stores/authStore";
import Game from "./pages/game";
import IndexMultiplayer from "./components/multiplayer/src/pages/Index";

const App = () => {
  useEffect(() => {
    return () => {
      unsubscribeAuth()
    }
  }, [])

  return (
    <Routes>
      <Route element={<LoginPage />}>
        <Route path="/auth/sign-in" element={<LoginForm />} />
        <Route path="/auth/sign-up" element={<SignUpForm />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route index path="/" element={<LandingPage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/multiplayer/:code" element={<IndexMultiplayer />} />

      </Route>
    </Routes>
  );
}

export default App;