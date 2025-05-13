import { Route, Routes } from "react-router";
import MainLayout from "./layouts/mainLayout";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index path="/" element={<div>Home</div>} />
      </Route>
    </Routes>
  );
}

export default App;