# NexTime Mobile 📱

NexTime là ứng dụng hỗ trợ quản lý lịch trình nhóm, tạo checklist, và tìm giờ rảnh chung. Xây dựng bằng React Native + Expo.

[![Test & Coverage](https://github.com/L02-BugFree/frontend/actions/workflows/test.yml/badge.svg)](https://github.com/L02-BugFree/frontend/actions/workflows/test.yml)
---

## 📊 CI & Quality Badges

[![Test & Coverage](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/actions/workflows/test.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/actions/workflows/test.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=nextime-mobile&metric=alert_status)](https://sonarcloud.io/dashboard?id=nextime-mobile)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=nextime-mobile&metric=coverage)](https://sonarcloud.io/dashboard?id=nextime-mobile)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=nextime-mobile&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=nextime-mobile)

> **Lưu ý:** Thay `YOUR_GITHUB_USERNAME` và `YOUR_REPO_NAME` bằng thông tin GitHub thực tế.

---

## 🚀 Chạy test locally

### Yêu cầu hệ thống
- Node.js ≥ 18
- npm ≥ 9

### Cài đặt dependencies

```bash
cd mobile
npm install --legacy-peer-deps
```

### Chạy tests và xem coverage

```bash
cd mobile
npm run test
```

Sau khi chạy xong:
- Kết quả test hiển thị trực tiếp trên Terminal
- **Coverage report (HTML):** `mobile/test-report/index.html`
- **Coverage raw data:** `mobile/coverage/lcov.info` (dùng cho SonarCloud)

### Coverage yêu cầu
| Metric | Ngưỡng |
|--------|--------|
| Lines  | ≥ 70%  |

---

## 🗂️ Cấu trúc test

```
mobile/
├── HomeScreen.tsx            # Màn hình chính
├── HomeScreen.test.tsx       # 4 test cases
├── OnboardingScreen.tsx      # Màn hình giới thiệu
├── OnboardingScreen.test.tsx # 5 test cases
└── jest.config.js            # Cấu hình Jest + coverage
```

### Danh sách test cases

**HomeScreen.test.tsx** (4 tests):
1. `renders without crashing` – Kiểm tra màn hình load thành công
2. `renders create schedule button` – Kiểm tra nút tạo lịch trình tồn tại
3. `handles create schedule button press without errors` – Ấn nút không gây crash
4. `calls onBack when logout button is pressed` – Kiểm tra callback khi ấn Quay lại

**OnboardingScreen.test.tsx** (5 tests):
1. `renders without crashing` – Kiểm tra màn hình load thành công
2. `renders login and register buttons` – Kiểm tra cả 2 nút hiển thị
3. `calls onNavigate when login button is pressed` – Callback đăng nhập hoạt động
4. `calls onNavigate when register button is pressed` – Callback đăng ký hoạt động
5. `handles button presses without errors when no callback provided` – Không crash khi không có callback

---

## 🏗️ Tech Stack

- **React Native** 0.81 + **Expo** 54
- **NativeWind** (TailwindCSS cho React Native)
- **Jest** + **jest-expo** + **@testing-library/react-native**
- **SonarCloud** (Code Quality & Security)
- **GitHub Actions** (CI/CD)

---

## 📱 Chạy app trên thiết bị

```bash
cd mobile
npm start          # Expo Dev Tools + QR Code
npm run android    # Android emulator
npm run ios        # iOS simulator (macOS only)
```
