import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  PanResponder,
} from "react-native";
import { ONBOARDING_ASSETS } from "../constants";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SLIDES = [
  {
    id: 0,
    logoType: "icon-text" as const,
    logoIcon: ONBOARDING_ASSETS.LOGO_ICON_0,
    heroImage: ONBOARDING_ASSETS.HERO_IMAGE_0,
    description:
      "Schedule Overlay: Xếp chồng lịch trình, tìm giờ rảnh nhóm nhanh chóng.",
  },
  {
    id: 1,
    logoType: "image" as const,
    logoIcon: ONBOARDING_ASSETS.LOGO_ICON_1,
    heroImage: ONBOARDING_ASSETS.HERO_IMAGE_1,
    description:
      "Prompt-to-checklist: Tạo checklist quản lý tác vụ nhóm thuận tiện, an toàn.",
  },
];

export default function OnboardingScreen({
  onLogin,
  onSignUp,
  /** @deprecated use onLogin instead */
  onNavigate,
}: {
  onLogin?: () => void;
  onSignUp?: () => void;
  onNavigate?: () => void;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const animateToSlide = useCallback(
    (nextIndex: number, direction: number = 1) => {
      if (nextIndex === currentSlide) return;

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -direction * 30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentSlide(nextIndex);
        slideAnim.setValue(direction * 30);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 80,
            friction: 12,
          }),
        ]).start();
      });
    },
    [currentSlide, fadeAnim, slideAnim]
  );

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % SLIDES.length;
        slideAnim.setValue(30);
        fadeAnim.setValue(0);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        ]).start();
        return next;
      });
    }, 4000);
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [startAutoPlay]);

  const goToSlide = useCallback(
    (index: number) => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      const direction = index > currentSlide ? 1 : -1;
      animateToSlide(index, direction);
      startAutoPlay();
    },
    [currentSlide, animateToSlide, startAutoPlay]
  );

  // Swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 15 && Math.abs(gs.dy) < 60,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -40) {
          setCurrentSlide((prev) => {
            const next = Math.min(prev + 1, SLIDES.length - 1);
            return next;
          });
        } else if (gs.dx > 40) {
          setCurrentSlide((prev) => Math.max(prev - 1, 0));
        }
      },
    })
  ).current;

  const slide = SLIDES[currentSlide];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container} {...panResponder.panHandlers}>
        {/* ── Top: Logo + Hero + Description + Dots ── */}
        <Animated.View
          style={[
            styles.topSection,
            { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Logo */}
          <View style={styles.logoWrapper}>
            {slide.logoType === "icon-text" ? (
              <View style={styles.logoIconRow}>
                <Image
                  source={slide.logoIcon}
                  style={styles.logoIconImg}
                  resizeMode="cover"
                />
                <Text testID="onboarding-title" style={styles.appName}>
                  NexTime
                </Text>
              </View>
            ) : (
              <Image
                source={slide.logoIcon}
                style={styles.logoTextImg}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Hero card */}
          <View style={styles.heroCard}>
            <Image
              source={slide.heroImage}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Description */}
          <Text style={styles.description}>{slide.description}</Text>

          {/* Pagination dots */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => goToSlide(idx)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={[
                  styles.dot,
                  idx === currentSlide ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* ── Bottom: Buttons + Footer ── */}
        <View style={styles.bottomSection}>
          {/* Login button */}
          <TouchableOpacity
            testID="login-btn"
            onPress={onLogin ?? onNavigate}
            style={styles.btnPrimary}
            activeOpacity={0.82}
          >
            <Text style={styles.btnPrimaryText}>Đăng nhập</Text>
          </TouchableOpacity>

          {/* Register button */}
          <TouchableOpacity
            testID="register-btn"
            onPress={onSignUp ?? onNavigate}
            style={styles.btnOutline}
            activeOpacity={0.82}
          >
            <Text style={styles.btnOutlineText}>Tạo tài khoản mới</Text>
          </TouchableOpacity>

          {/* Language + Dark mode */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.footerItem} activeOpacity={0.7}>
              <Image
                source={ONBOARDING_ASSETS.VIETNAM_FLAG}
                style={styles.footerIcon}
                resizeMode="contain"
              />
              <Text style={styles.footerText}>TIẾNG VIỆT / ENGLISH</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerItem} activeOpacity={0.7}>
              <Image
                source={ONBOARDING_ASSETS.DARK_MODE_ICON}
                style={styles.footerIcon}
                resizeMode="contain"
                tintColor="#6F7380"
              />
              <Text style={styles.footerText}>DARK MODE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const BLUE = "#0866FF";
const TEXT_DARK = "#33363F";
const TEXT_MUTED = "#6F7380";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 20 : 12,
    paddingBottom: 16,
    justifyContent: "space-between",
  },

  // ── Top section ──
  topSection: {
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },

  // Logo
  logoWrapper: {
    alignItems: "center",
    marginBottom: 12,
  },
  logoIconRow: {
    alignItems: "center",
    gap: 10,
  },
  logoIconImg: {
    width: 72,
    height: 72,
    borderRadius: 16,
  },
  appName: {
    fontSize: 26,
    fontWeight: "700",
    color: TEXT_DARK,
    letterSpacing: -0.5,
    marginTop: 8,
  },
  logoTextImg: {
    width: 160,
    height: 48,
  },

  // Hero card
  heroCard: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
      },
      android: { elevation: 8 },
      default: {},
    }),
    backgroundColor: "#F0F2F8",
  },
  heroImage: {
    width: "100%",
    height: 210,
  },

  // Description
  description: {
    fontSize: 14,
    fontWeight: "500",
    color: TEXT_DARK,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    borderRadius: 99,
  },
  dotActive: {
    width: 22,
    height: 8,
    backgroundColor: BLUE,
    borderRadius: 4,
  },
  dotInactive: {
    width: 8,
    height: 8,
    backgroundColor: "#C8CACC",
  },

  // ── Bottom section ──
  bottomSection: {
    width: "100%",
    gap: 10,
    paddingTop: 4,
  },
  btnPrimary: {
    height: 50,
    backgroundColor: BLUE,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: BLUE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  btnOutline: {
    height: 50,
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  btnOutlineText: {
    fontSize: 16,
    fontWeight: "600",
    color: BLUE,
    letterSpacing: 0.2,
  },

  // Footer
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 4,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  footerIcon: {
    width: 14,
    height: 14,
    tintColor: TEXT_MUTED,
  },
  footerText: {
    fontSize: 10,
    fontWeight: "500",
    color: TEXT_MUTED,
    letterSpacing: 0.8,
  },
});
