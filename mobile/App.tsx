import { useState } from "react";
import OnboardingScreen from "./OnboardingScreen";
import HomeScreen from "./HomeScreen";
import "./global.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <HomeScreen onBack={() => setIsLoggedIn(false)} />;
  }

  return <OnboardingScreen onNavigate={() => setIsLoggedIn(true)} />;
}
