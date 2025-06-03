import { Navigate, Route, Routes } from "react-router";
import { Toaster } from 'react-hot-toast'
import MainLayout from "./layouts/mainLayout";
import LoginPage from "./pages/loginPage";
// import HomePage from "./pages/homePage";
import LoginForm from "./components/auth/loginForm";
import SignUpForm from "./components/auth/registerForm";
import LandingPage from "./pages/landingPage";
import { useEffect } from "react";
import { unsubscribeAuth } from "./stores/authStore";
import Game from "./pages/game";
import DashboardPage from "./pages/dashboard";
import IndexMultiplayer from "./components/multiplayer/src/pages/Index";
import ProtectedRoute from "./guards/privateRoutes";
import { OverviewSection } from "./components/dashboard/sections/overview-section";
import { UserManagementSection } from "./components/dashboard/sections/userManagement-section";
import { CategoriesSection } from "./components/dashboard/sections/categories-section";
import { QuestionsSection } from "./components/dashboard/sections/questions-section";
import { SettingsSection } from "./components/dashboard/sections/settings-section";
import DashboardSkeleton from "./components/dashboard/dashboardSkeleton";

const App = () => {
  useEffect(() => {
    return () => {
      unsubscribeAuth()
    }
  }, [])

  return (
    <>
      <Routes>
        <Route element={<LoginPage />}>
          <Route path="/auth/sign-in" element={<LoginForm />} />
          <Route path="/auth/sign-up" element={<SignUpForm />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route index path="/" element={<LandingPage />} />
          <Route path="/game" element={<Game />} />
          <Route path="/multiplayer" element={<IndexMultiplayer />} />
        </Route>
        <Route path="/dashboard/*" element={
          <ProtectedRoute roles={['admin']} skeleton={<DashboardSkeleton />}>
            <DashboardPage />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewSection userRole="admin" />} />
          <Route path="users" element={<UserManagementSection />} />
          <Route path="categories" element={<CategoriesSection />} />
          <Route path="questions" element={<QuestionsSection />} />
          {/* <Route path="play" element={<DashboardPage />} /> */}
          <Route path="settings" element={<SettingsSection />} />
        </Route>
        {/* <Route path="/dashboarddd" element={<DashboardPage />} /> */}
      </Routes>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 1000,
          style: {
            background: "white",
            color: "black",
          },
          error: {
            duration: 1500,
          },
          success: {
            duration: 2000,
          },
          custom: {
            duration: 1000
          }
        }}
      />
    </>
  );
}

export default App;