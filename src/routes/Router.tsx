import { Routes, Route } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import HomePage from "../pages/HomePage";

export default function Router() {
	console.log("Inside the Router function");
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

