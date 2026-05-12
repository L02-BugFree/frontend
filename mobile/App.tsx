import { useState } from "react";
import { Platform, View, StyleSheet } from "react-native";
import OnboardingScreen    from "./src/screens/OnboardingScreen";
import LoginScreen         from "./src/screens/LoginScreen";
import SignUpScreen        from "./src/screens/SignUpScreen";
import MainChatScreen      from "./src/screens/MainChatScreen";
import ChatRoomScreen      from "./src/screens/ChatRoomScreen";
import GroupScheduleScreen from "./src/screens/GroupScheduleScreen";
import type { Conversation } from "./src/screens/MainChatScreen";
import "./global.css";

type Screen = "onboarding" | "login" | "signup" | "main" | "chatroom" | "groupschedule";

export default function App() {
  const [screen, setScreen]         = useState<Screen>("main"); // for testing, use "onboarding" to test onboarding screen
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);

  const openChat = (conv: Conversation) => {
    setActiveConv(conv);
    setScreen("chatroom");
  };

  const renderScreen = () => {
    switch (screen) {
      case "main":
        return <MainChatScreen onOpenChat={openChat} />;

      case "chatroom":
        return activeConv ? (
          <ChatRoomScreen
            conversation={activeConv}
            onBack={() => setScreen("main")}
            onOpenSchedule={() => setScreen("groupschedule")}
          />
        ) : null;

      case "groupschedule":
        return activeConv ? (
          <GroupScheduleScreen
            conversation={activeConv}
            onBack={() => setScreen("chatroom")}
          />
        ) : null;

      case "login":
        return (
          <LoginScreen
            onBack={() => setScreen("onboarding")}
            onSuccess={() => setScreen("main")}
          />
        );

      case "signup":
        return (
          <SignUpScreen
            onBack={() => setScreen("onboarding")}
            onSuccess={() => setScreen("main")}
          />
        );

      default:
        return (
          <OnboardingScreen
            onLogin={() => setScreen("login")}
            onSignUp={() => setScreen("signup")}
          />
        );
    }
  };

  const content = renderScreen();

  if (Platform.OS === "web") {
    return (
      <View style={ws.root}>
        <View style={ws.frame}>{content}</View>
      </View>
    );
  }

  return content;
}

const ws = StyleSheet.create({
  root: {
    flex: 1, backgroundColor: "#E8ECF4",
    alignItems: "center", justifyContent: "center",
    minHeight: "100vh" as any,
  },
  frame: {
    width: 390, height: 844,
    backgroundColor: "#fff", borderRadius: 44, overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.22, shadowRadius: 48,
    boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
  } as any,
});
