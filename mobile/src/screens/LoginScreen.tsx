import { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  StatusBar, StyleSheet, Platform, Animated, Modal, Pressable,
  KeyboardAvoidingView, ScrollView,
} from "react-native";
import { authApi, auth } from "../constants/api";

// ── Types ────────────────────────────────────────────────────────────────────
interface LoginScreenProps {
  onBack?: () => void;
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LoginScreen({
  onBack,
  onSuccess,
  onForgotPassword,
}: LoginScreenProps) {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Shake animation for invalid submission
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setErrorVisible(true);
    shake();
  };

  const handleSubmit = async () => {
    if (!contact.trim() && !password.trim()) {
      showError("Đăng nhập thất bại\ndo người dùng\nchưa nhập dữ liệu");
      return;
    }
    if (!contact.trim()) {
      showError("Vui lòng nhập số điện thoại\nhoặc email của bạn.");
      return;
    }
    if (!password.trim()) {
      showError("Vui lòng nhập mật khẩu.");
      return;
    }
    if (!agreed) {
      showError("Vui lòng đồng ý với\nđiều khoản sử dụng.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login(contact.trim(), password);
      auth.setToken(res.access_token);
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.message ?? "Đăng nhập thất bại. Vui lòng thử lại.";
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isReady = contact.trim().length > 0 && password.trim().length > 0 && agreed;

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <TouchableOpacity
            onPress={onBack}
            style={s.backBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.6}
          >
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Đăng nhập</Text>
          <View style={s.backBtn} />
        </View>

        <ScrollView
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Subtitle */}
          <Text style={s.subtitle}>Vui lòng nhập thông tin tài khoản</Text>

          {/* ── Form ── */}
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            {/* Contact input */}
            <TextInput
              style={[s.input, contact.length > 0 && s.inputFilled]}
              placeholder="Số điện thoại hoặc email"
              placeholderTextColor="#BCBEC8"
              value={contact}
              onChangeText={setContact}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              textContentType="emailAddress"
            />

            {/* Password input */}
            <View style={s.passwordRow}>
              <TextInput
                style={[s.input, s.passwordInput, password.length > 0 && s.inputFilled]}
                placeholder="Mật khẩu"
                placeholderTextColor="#BCBEC8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
                textContentType="password"
              />
              <TouchableOpacity
                style={s.eyeBtn}
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={s.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              onPress={onForgotPassword}
              style={s.forgotRow}
              activeOpacity={0.7}
            >
              <Text style={s.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Terms checkbox */}
            <TouchableOpacity
              style={s.checkboxRow}
              onPress={() => setAgreed((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={[s.checkbox, agreed && s.checkboxChecked]}>
                {agreed && <Text style={s.checkmark}>✓</Text>}
              </View>
              <Text style={s.termsText}>
                Đồng ý với{" "}
                <Text style={s.termsLink}>điều khoản sử dụng</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* ── Submit ── */}
          <TouchableOpacity
            style={[s.submitBtn, loading && s.submitLoading]}
            onPress={handleSubmit}
            activeOpacity={0.82}
          >
            <Text style={s.submitText}>
              {loading ? "Đang xử lý…" : "Tiếp tục"}
            </Text>
          </TouchableOpacity>

          {/* ── Divider ── */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>Hoặc</Text>
            <View style={s.dividerLine} />
          </View>

          {/* ── Google button ── */}
          <TouchableOpacity style={s.googleBtn} activeOpacity={0.8}>
            {/* Google "G" logo using coloured text — works without images */}
            <View style={s.googleIconWrapper}>
              <Text style={s.googleIcon}>G</Text>
            </View>
            <Text style={s.googleText}>Đăng nhập bằng Google</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Error Modal ── */}
      <Modal
        visible={errorVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorVisible(false)}
      >
        <Pressable
          style={s.modalOverlay}
          onPress={() => setErrorVisible(false)}
        >
          <Pressable style={s.modalCard} onPress={() => {}}>
            <Text style={s.modalMsg}>{errorMsg}</Text>
            <TouchableOpacity
              style={s.retryBtn}
              onPress={() => setErrorVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={s.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BLUE = "#0866FF";
const TEXT_DARK = "#1A1D2E";
const TEXT_MUTED = "#6F7380";
const BORDER = "#E4E6EF";
const BG_INPUT = "#F7F8FA";

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 22,
    color: TEXT_DARK,
    lineHeight: 28,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: TEXT_DARK,
    letterSpacing: -0.2,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },

  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: TEXT_DARK,
    marginBottom: 24,
  },

  // Inputs
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: TEXT_DARK,
    backgroundColor: BG_INPUT,
    marginBottom: 14,
  },
  inputFilled: {
    borderColor: "#C0CEFA",
    backgroundColor: "#F0F4FF",
  },
  passwordRow: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 52,
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 0,
    height: 50,
    justifyContent: "center",
  },
  eyeIcon: {
    fontSize: 16,
  },

  // Forgot
  forgotRow: {
    alignItems: "flex-end",
    marginTop: -6,
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "500",
    color: BLUE,
  },

  // Checkbox
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#C0C4D6",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
  },
  termsText: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  termsLink: {
    color: BLUE,
    fontWeight: "500",
  },

  // Submit
  submitBtn: {
    height: 52,
    backgroundColor: BLUE,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
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
  submitLoading: {
    backgroundColor: "#5A9AFF",
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
  },
  dividerText: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: "400",
  },

  // Google
  googleBtn: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    // Simulated Google coloured G
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
  },
  googleIcon: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4285F4",
    lineHeight: 16,
  },
  googleText: {
    fontSize: 15,
    fontWeight: "500",
    color: TEXT_DARK,
  },

  // Error Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 28,
    alignItems: "center",
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
      default: {},
    }),
  },
  modalMsg: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 24,
  },
  retryBtn: {
    width: "100%",
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_DARK,
  },
});
