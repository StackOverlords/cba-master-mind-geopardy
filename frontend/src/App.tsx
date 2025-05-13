import { Route, Routes } from "react-router";
import MainLayout from "./layouts/mainLayout";
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/homePage";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;