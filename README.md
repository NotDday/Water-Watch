# 🌊 Cherthala Water Watch

<p align="center">
  <img src="assets/images/icon.png" width="96" height="96" alt="Water Watch Logo" style="border-radius: 20px;" />
</p>

<p align="center">
  <strong>Smart Saline Water Intrusion Monitoring, AI Risk Forecasting & Citizen Grievance Redressal</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK%2057-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 57" />
  <img src="https://img.shields.io/badge/React%20Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native 0.86" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

---

## 📖 Overview

**Cherthala Water Watch** is a real-time mobile application designed to protect drinking water and agricultural canals in the Cherthala taluk (Kerala, India) against **saline water intrusion** from the Arabian Sea and Vembanad Lake backwaters.

The system connects field **IoT sensor stations (ESP32)** measuring water quality parameters with a **machine learning risk prediction engine**, delivering instant data, intrusion alerts, and a transparent **grievance reporting pipeline** directly to citizens and municipal authorities.

> 📄 **Looking for the complete architecture and hardware roadmap?**  
> See the [Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md) covering IoT firmware, Supabase/PostgreSQL schema, and ML model training.

---

## ✨ Key Features

- **🏠 Real-time Home Dashboard**
  - Live salinity risk gauge with color-coded severity levels (*Low*, *Moderate*, *High*, *Critical*).
  - Quick-glance metrics for Electrical Conductivity (EC), Total Dissolved Solids (TDS), pH, and water temperature.
  - Multi-station status overview across Cherthala monitoring points.
  - 24-hour predictive AI salinity risk forecast.

- **📊 Live Station Monitoring**
  - Dedicated telemetry screen for each monitoring station (`ST-001`, `ST-002`, `ST-003`).
  - Parameter breakdown with safety threshold benchmarks.
  - Real-time station telemetry status, GPS coordinates, and signal indicators.

- **📝 Grievance & Complaint Redressal**
  - Transparent grievance logging for citizens reporting water salinity, contamination, canal flooding, or infrastructure issues.
  - End-to-end status lifecycle tracking:  
    `Submitted` ➔ `Under Investigation` ➔ `Action Taken` ➔ `Resolved`.
  - Filterable complaint history with timestamps and location tags.

- **🎨 Adaptive Theme & Modern UI**
  - Glassmorphic card styling with smooth fluid animations powered by React Native Reanimated.
  - Seamless support for **Dark Mode**, **Light Mode**, and **System Default**.

---

## 🛠️ Tech Stack

- **Framework**: [React Native 0.86](https://reactnative.dev/) with [Expo SDK 57](https://docs.expo.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation with typed routes)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) & [React Native Worklets](https://github.com/software-mansion/react-native-worklets)
- **UI Components**: Custom glassmorphism UI kit + [React Native Paper](https://callstack.github.io/react-native-paper/)
- **Icons**: `@expo/vector-icons` (Ionicons & MaterialCommunityIcons) and `expo-symbols`
- **Language**: TypeScript (strict configuration)
- **Quality**: ESLint with `eslint-config-expo`

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or newer recommended, LTS version)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [Expo Go](https://expo.dev/go) app on your physical iOS or Android phone, OR an Android Emulator / iOS Simulator.

### 1. Clone the Repository

```bash
git clone https://github.com/NotDday/Water-Watch.git
cd Water-Watch
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables (Optional)

Copy the sample environment file:

```bash
cp .env.example .env
```

Set your Supabase project credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start the Development Server

```bash
npm start
```

In the interactive terminal:
- Scan the printed QR code with **Expo Go** (Android) or the default **Camera app** (iOS).
- Press `a` to open in an **Android Emulator**.
- Press `i` to open in an **iOS Simulator**.
- Press `w` to open in your **Web Browser**.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Launches the Expo development server with Metro bundler |
| `npm run android` | Starts the app directly targeting an connected Android device/emulator |
| `npm run ios` | Starts the app targeting an iOS simulator (macOS required) |
| `npm run web` | Launches the web preview in your default browser |
| `npm run lint` | Runs ESLint across all TypeScript and React files |
| `npm run typecheck` | Validates TypeScript types across the entire project (`tsc --noEmit`) |

---

## 📁 Project Directory Structure

```text
Water-Watch/
├── .vscode/               # Recommended VS Code extensions & settings
├── assets/                # App icons, splash screens, and adaptive assets
│   ├── expo.icon/         # Apple/watch icon configuration
│   └── images/            # App icons, adaptive icons, splash icon
├── docs/                  # Project specifications & architecture documentation
│   └── IMPLEMENTATION_ROADMAP.md  # Detailed IoT, Backend, ML & Grievance specs
├── src/
│   ├── app/               # Expo Router screen routes
│   │   ├── _layout.tsx    # Root layout, theme provider, and tab configuration
│   │   ├── index.tsx      # Home screen (Risk gauge, metrics summary, AI forecast)
│   │   ├── monitoring.tsx # Live station telemetry & threshold monitoring
│   │   ├── complaints.tsx # Grievance registration & lifecycle tracking
│   │   └── profile.tsx    # User settings, alert preferences & theme switcher
│   ├── components/        # Reusable application components
│   │   ├── app-tabs.tsx   # Native tab navigation bar
│   │   ├── app-tabs.web.tsx # Web navigation bar
│   │   ├── external-link.tsx # Safe in-app web browser opener
│   │   ├── themed-text.tsx  # Theme-aware typography component
│   │   ├── themed-view.tsx  # Theme-aware container component
│   │   └── ui/            # UI kit (AnimatedGauge, GlassCard, GradientBackground, etc.)
│   ├── constants/         # Theme palettes, typography tokens, and spacing
│   ├── context/           # React Context providers (ThemeContext)
│   ├── data/              # TypeScript models, data interfaces & mock datasets
│   └── hooks/             # Custom React hooks (useTheme, useColorScheme)
├── .env.example           # Example environment variables template
├── .gitignore             # Git ignore rules for React Native & Expo
├── app.json               # Expo application configuration & metadata
├── eslint.config.js       # ESLint flat configuration
├── package.json           # Project dependencies & scripts
├── tsconfig.json          # TypeScript compiler configuration
└── README.md              # Project documentation
```

---

## 🗺️ Next Steps & Team Roadmap

For team members working on completing the upcoming features, please refer to the phases outlined in [docs/IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md):

1. **Backend Integration**: Replace `src/data/mockData.ts` with live REST endpoints (`/api/sensor/readings`, `/api/complaints`, `/api/stations`).
2. **Grievance Photo Upload**: Integrate `expo-image-picker` to enable citizens to snap and upload water contamination photos.
3. **Push Notifications**: Configure Expo Push Notifications / FCM for instant alerts on critical salinity spikes.
4. **Interactive GIS Map**: Integrate MapView to visualize stations and affected salinity zones across Cherthala.
5. **Municipality Admin View**: Implement role-based access for municipal engineers to assign officers and resolve complaints.

---

## 🤝 Contributing Guidelines

1. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Ensure code cleanliness**: Before committing, verify that linting and typecheck pass:
   ```bash
   npm run lint
   npm run typecheck
   ```
3. **Commit with descriptive messages**:
   ```bash
   git commit -m "feat: integrate real-time sensor API endpoint"
   ```
4. **Push and create a Pull Request** to `master` for review.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
