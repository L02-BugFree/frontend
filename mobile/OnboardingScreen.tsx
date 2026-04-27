import { useState, useEffect, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { ONBOARDING_ASSETS } from "./Constants";

const SLIDES = [
  {
    id: 0,
    logoType: "icon-text",
    logoIcon: ONBOARDING_ASSETS.LOGO_ICON_0,
    heroImage: ONBOARDING_ASSETS.HERO_IMAGE_0,
    heroShadow: false,
    description: "Schedule Overlay: Xếp chồng lịch trình, tìm giờ rảnh nhóm nhanh chóng.",
  },
  {
    id: 1,
    logoType: "image",
    logoIcon: ONBOARDING_ASSETS.LOGO_ICON_1,
    heroImage: ONBOARDING_ASSETS.HERO_IMAGE_1,
    heroShadow: true,
    description: "Promt-to-checklist: Tạo checklist quản lý tác vụ nhóm thuận tiện, an toàn.",
  },
];

export default function OnboardingScreen({ onNavigate }: { onNavigate?: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 items-center px-4 pt-6 pb-2 justify-between">
        {/* Top Section */}
        <View className="w-full max-w-sm flex-1 items-center justify-start gap-4 mt-8">
          {/* Logo */}
          <View className="items-center justify-center h-28">
            {slide.logoType === "icon-text" ? (
              <View className="items-center">
                <Image
                  source={{ uri: slide.logoIcon }}
                  className="w-[102px] h-[102px] rounded-full"
                  resizeMode="cover"
                />
                <Text testID="onboarding-title" className="font-bold text-[32px] text-[#40434D] mt-2">
                  NexTime
                </Text>
              </View>
            ) : (
              <Image
                source={{ uri: slide.logoIcon }}
                className="w-[127px] h-12"
                resizeMode="contain"
              />
            )}
          </View>

          {/* Hero Image */}
          <Image
            source={{ uri: slide.heroImage }}
            className={`w-full max-w-[388px] rounded-xl my-4`}
            style={{ aspectRatio: 388 / 281, shadowColor: slide.heroShadow ? "#000" : "transparent", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: slide.heroShadow ? 8 : 0 }}
            resizeMode="cover"
          />

          {/* Description */}
          <Text className="font-medium text-base text-[#40434D] text-center px-8">
            {slide.description}
          </Text>

          {/* Pagination dots */}
          <View className="flex-row items-center justify-center gap-2.5 mt-6">
            {SLIDES.map((_, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => goToSlide(idx)}
                className={`rounded-full ${
                  idx === currentSlide
                    ? "w-3.5 h-3.5 bg-[#0866FF]"
                    : "w-2.5 h-2.5 bg-[#9FA3B3]"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Bottom Section */}
        <View className="w-full max-w-sm gap-4 mb-4">
          <View className="w-full gap-4">
            <TouchableOpacity 
              testID="login-btn"
              onPress={onNavigate}
              className="h-12 bg-[#0866FF] rounded-xl items-center justify-center"
            >
              <Text className="font-semibold text-base text-white">Đăng nhập</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              testID="register-btn"
              onPress={onNavigate}
              className="h-12 border-2 border-[#0866FF] rounded-xl items-center justify-center"
            >
              <Text className="font-semibold text-base text-[#0866FF]">Tạo tài khoản mới</Text>
            </TouchableOpacity>
          </View>

          {/* Language + Dark mode */}
          <View className="flex-row justify-between items-center px-6 mt-4">
            {/* Language */}
            <View className="flex-row items-center gap-1.5">
              <Image
                source={{ uri: ONBOARDING_ASSETS.VIETNAM_FLAG }}
                className="w-3 h-3"
              />
              <Text className="font-medium text-[10px] text-[#6F7380] uppercase tracking-wider">
                Tiếng Việt / English
              </Text>
            </View>

            {/* Dark mode */}
            <View className="flex-row items-center gap-1.5">
              <Image
                source={{ uri: ONBOARDING_ASSETS.DARK_MODE_ICON }}
                className="w-[11px] h-[11px]"
              />
              <Text className="font-medium text-[10px] text-[#6F7380] uppercase tracking-wider">
                Dark mode
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
