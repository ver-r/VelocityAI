import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { SignedIn } from "@clerk/clerk-react";

import Landing from "./pages/Landing";
import Quiz from "./pages/Quiz";

import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Trends from "./pages/dashboard/Trends";

export default function App() {
  return (
    <BrowserRouter>
    <Routes>

      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/quiz" element={<SignedIn><Quiz /></SignedIn>} />

      {/* Protected Dashboard Layout */}
      <Route
        path="/dashboard"
        element={
          <SignedIn>
            <DashboardLayout />
          </SignedIn>
        }
      >
        <Route index element={<Overview />} />
        <Route path="trends" element={<Trends />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
    </BrowserRouter>
  );
}