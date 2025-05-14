import { Route, Routes } from "react-router";
import MainLayout from "./layouts/mainLayout";
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/homePage";
import LoginForm from "./components/auth/loginForm";
import SignUpForm from "./components/auth/registerForm";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index path="/" element={<HomePage />} />
        <Route element={<LoginPage />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;