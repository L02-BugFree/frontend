import { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  StatusBar, ScrollView, StyleSheet, Platform,
  Pressable, KeyboardAvoidingView, Modal,
} from "react-native";
import { authApi, auth } from "../constants/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SignUpScreenProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

// ── Gender Picker ──────────────────────────────────────────────────────────────
const GENDER_OPTIONS = ["Nam", "Nữ", "Khác"];

// ── Component ─────────────────────────────────────────────────────────────────
export default function SignUpScreen({ onBack, onSuccess }: SignUpScreenProps) {
  const [displayName, setDisplayName] = useState("");
  const [birthday, setBirthday] = useState("15/12/2005");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const [loading, setLoading]   = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --- Helpers ---
  const formatBirthday = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    let result = digits;
    if (digits.length > 4) result = digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
    else if (digits.length > 2) result = digits.slice(0, 2) + "/" + digits.slice(2);
    return result;
  };

  const handleBirthdayChange = (text: string) => {
    setBirthday(formatBirthday(text));
  };

  // Convert DD/MM/YYYY → ISO YYYY-MM-DD
  const parseBirthdate = (dmy: string) => {
    const [d, m, y] = dmy.split("/");
    return y && m && d ? `${y}-${m}-${d}` : undefined;
  };

  const canSubmit =
    displayName.trim().length > 0 &&
    birthday.length === 10 &&
    contact.trim().length > 0 &&
    password.length >= 6 &&
    agreed;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await authApi.register({
        email: contact.trim(),
        password,
        displayName: displayName.trim(),
        birthdate: parseBirthdate(birthday),
        gender: gender || undefined,
      });
      auth.setToken(res.access_token);
      onSuccess?.();
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

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
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.6}
          >
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Tạo tài khoản mới</Text>
          <View style={s.backBtn} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ══ Section 1: Account Info ═══════════════════════════════════════ */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Thông tin tài khoản</Text>

            {/* Avatar */}
            <TouchableOpacity style={s.avatarWrapper} activeOpacity={0.75}>
              <View style={s.avatarCircle}>
                {/* Person silhouette using shapes */}
                <View style={s.avatarHead} />
                <View style={s.avatarBody} />
              </View>
              <View style={s.cameraBadge}>
                <Text style={s.cameraIcon}>📷</Text>
              </View>
            </TouchableOpacity>

            {/* Display Name */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>Tên hiển thị</Text>
              <TextInput
                style={s.input}
                placeholder="Nhập tên người dùng"
                placeholderTextColor="#BCBEC8"
                value={displayName}
                onChangeText={setDisplayName}
                returnKeyType="next"
                autoCapitalize="words"
              />
            </View>

            {/* Birthday + Gender row */}
            <View style={s.rowGroup}>
              <View style={[s.fieldGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={s.fieldLabel}>Sinh nhật</Text>
                <TextInput
                  style={s.input}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#BCBEC8"
                  value={birthday}
                  onChangeText={handleBirthdayChange}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>
              <View style={[s.fieldGroup, { flex: 1 }]}>
                <Text style={s.fieldLabel}>Giới tính</Text>
                <TouchableOpacity
                  style={[s.input, s.selectInput]}
                  onPress={() => setGenderModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={gender ? s.selectValue : s.selectPlaceholder}>
                    {gender || "Chọn"}
                  </Text>
                  <Text style={s.chevron}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ══ Section 2: Login Info ═════════════════════════════════════════ */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Thông tin đăng nhập</Text>

            {/* Phone / Email */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>SĐT / Email đăng ký</Text>
              <TextInput
                style={s.input}
                placeholder="Nhập thông tin liên hệ"
                placeholderTextColor="#BCBEC8"
                value={contact}
                onChangeText={setContact}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            {/* Password */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>Mật khẩu</Text>
              <View style={s.passwordWrapper}>
                <TextInput
                  style={[s.input, s.passwordInput]}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#BCBEC8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={s.eyeBtn}
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={s.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ── Terms checkbox ── */}
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

          {/* Error banner */}
          {!!errorMsg && (
            <View style={s.errorBanner}>
              <Text style={s.errorBannerTxt}>⚠️  {errorMsg}</Text>
            </View>
          )}

          {/* ── Submit button ── */}
          <TouchableOpacity
            style={[s.submitBtn, (!canSubmit || loading) && s.submitBtnDisabled]}
            onPress={handleSubmit}
            activeOpacity={canSubmit ? 0.82 : 1}
          >
            <Text style={[s.submitText, !canSubmit && s.submitTextDisabled]}>
              {loading ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
            </Text>
          </TouchableOpacity>

          {/* ── Login link ── */}
          <TouchableOpacity onPress={onBack} style={s.loginLinkRow} activeOpacity={0.7}>
            <Text style={s.loginLinkText}>
              Đã có tài khoản?{" "}
              <Text style={s.loginLinkBold}>Đăng nhập</Text>
            </Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Gender Modal ── */}
      <Modal
        visible={genderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <Pressable
          style={s.modalOverlay}
          onPress={() => setGenderModalVisible(false)}
        >
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Chọn giới tính</Text>
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  s.modalOption,
                  gender === opt && s.modalOptionSelected,
                ]}
                onPress={() => {
                  setGender(opt);
                  setGenderModalVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    s.modalOptionText,
                    gender === opt && s.modalOptionTextSelected,
                  ]}
                >
                  {opt}
                </Text>
                {gender === opt && <Text style={s.modalCheckmark}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={s.modalCancelBtn}
              onPress={() => setGenderModalVisible(false)}
            >
              <Text style={s.modalCancelText}>Huỷ</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const BLUE = "#0866FF";
const TEXT_DARK = "#1A1D2E";
const TEXT_MUTED = "#6F7380";
const BORDER = "#E4E6EF";
const BG = "#F7F8FA";

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
    backgroundColor: "#FFFFFF",
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
    fontWeight: "400",
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
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // Section card
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 14,
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: BLUE,
    marginBottom: 16,
    letterSpacing: 0.1,
  },

  // Avatar
  avatarWrapper: {
    alignSelf: "center",
    marginBottom: 20,
    position: "relative",
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#D8DCE8",
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  avatarHead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#A0A8C0",
    position: "absolute",
    top: 16,
  },
  avatarBody: {
    width: 64,
    height: 40,
    borderRadius: 32,
    backgroundColor: "#A0A8C0",
    marginBottom: -8,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  cameraIcon: {
    fontSize: 11,
  },

  // Fields
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: TEXT_DARK,
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: TEXT_DARK,
    backgroundColor: BG,
  },
  rowGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectValue: {
    fontSize: 14,
    color: TEXT_DARK,
  },
  selectPlaceholder: {
    fontSize: 14,
    color: "#BCBEC8",
  },
  chevron: {
    fontSize: 18,
    color: TEXT_MUTED,
    marginTop: -2,
  },

  // Password
  passwordWrapper: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeIcon: {
    fontSize: 16,
  },

  // Checkbox
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 2,
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
    flex: 1,
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
    marginBottom: 16,
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
  submitBtnDisabled: {
    backgroundColor: "#C4D4FB",
    ...Platform.select({
      ios: { shadowOpacity: 0 },
      android: { elevation: 0 },
      default: {},
    }),
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  submitTextDisabled: {
    color: "rgba(255,255,255,0.75)",
  },

  // Login link
  loginLinkRow: {
    alignItems: "center",
    paddingVertical: 4,
  },
  loginLinkText: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  loginLinkBold: {
    color: BLUE,
    fontWeight: "600",
  },

  // Error banner
  errorBanner: {
    backgroundColor: "#FFF0F0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFCCCC",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  errorBannerTxt: {
    fontSize: 13,
    color: "#D93025",
    fontWeight: "500",
    lineHeight: 18,
  },

  // Gender modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_DARK,
    textAlign: "center",
    marginBottom: 12,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  modalOptionSelected: {
    // no extra bg, just the checkmark
  },
  modalOptionText: {
    fontSize: 15,
    color: TEXT_DARK,
  },
  modalOptionTextSelected: {
    color: BLUE,
    fontWeight: "600",
  },
  modalCheckmark: {
    fontSize: 16,
    color: BLUE,
    fontWeight: "700",
  },
  modalCancelBtn: {
    marginTop: 12,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: {
    fontSize: 15,
    color: TEXT_MUTED,
    fontWeight: "500",
  },
});
