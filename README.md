# Movie Explorer — React Native CLI with Deep Linking

A polished TV show explorer built with **React Native CLI** (not Expo).  
The app fetches data from the **TVMaze API**, displays it in a visually appealing list, and supports **deep linking** directly into a show’s detail screen (`myapp://show/:id`).  
It includes animation, clean UI, dark/light mode support, error handling, search, pull-to-refresh, and an in-memory cache — all implemented using **functional components with hooks**.

---

## 🎯 Goal

Design and build a React Native app that lists TV shows from TVMaze and supports deep linking into a show’s detail screen.  
The app must feel responsive, animated, visually polished, and handle all loading/error states gracefully.

---

## 🧩 Features Overview

### Home Screen (MovieListScreen)
- Fetches list of shows from: `https://api.tvmaze.com/shows`
- Displays a scrollable list of cards with:
  - Title  
  - Thumbnail (`image.medium`)  
  - Language or Rating  
- Cards have rounded corners, consistent spacing, readable typography, and shadows.
- Includes a **search bar** for filtering by show name.
- **Pull-to-refresh** support.
- Handles **loading**, **error**, and **empty** states.
- Integrates a **smooth animated header** to enrich the UX.

### Details Screen (MovieDetailScreen)
- Displays the selected show’s:
  - Title  
  - Large image (prefers `image.original`, fallback to `image.medium`)  
  - Summary (HTML stripped)  
  - Rating  
  - Genres as compact “chips”.
- Layout uses proper spacing and readable line length.
- Gracefully handles loading, error, and missing fields.

### Navigation & Deep Linking
- Uses **React Navigation** (`@react-navigation/native`, `@react-navigation/native-stack`).
- Tapping a card navigates to the Details screen with the show’s id.
- Supports deep links of the form `myapp://show/123`:
  - If the app is closed → opens directly to that show’s details screen.
  - If the app is open → navigates to that show’s details screen.

### Technical Requirements
- Built with **React Native CLI** (not Expo).
- **Functional components** using `useState`, `useEffect`, and `useFocusEffect`.
- Graceful handling of loading, error, and retry states.
- Optional TypeScript (used here).
- Bonus:
  - Search bar
  - Pull-to-refresh
  - In-memory caching (light “offline-like” fallback)

---

## ⚙️ Setup & Run (Windows / Android)

> Prereqs: Node.js LTS, Yarn, Android Studio (SDK + platform-tools), ADB in PATH, JDK 17.

```powershell
# Install dependencies
yarn
yarn add @react-navigation/native @react-navigation/native-stack
yarn add react-native-screens react-native-safe-area-context

# Run the app on Android
yarn android

```
## 💫 Animation Technique

The animation in *Movie Explorer* was implemented entirely using React Native’s **Animated API** and the **BlurView** component from `@react-native-community/blur`.  
The goal was to recreate the smooth, cinematic motion style demonstrated in the reference video, while maintaining top performance and minimal dependency usage.

---

### 🧠 Tools & Approach

- **Animated API (React Native Core)**  
  Used to create continuous and scroll-based animations.  
  This includes:
  - A gentle “glow” animation behind the header title that subtly moves and scales, providing a feeling of depth and liveliness.
  - A dynamic interpolation system that reacts to scroll position, used to control opacity and blur for each list item as it approaches the top of the screen.

- **BlurView (@react-native-community/blur)**  
  Applied to each card to achieve a smooth depth-of-field transition.  
  As the user scrolls, cards closer to the header become softly blurred — enhancing visual focus and giving the interface a cinematic feel.

---

### 🎨 Design Intent

The animation was designed to be **subtle and non-intrusive**, focusing on visual polish rather than distraction.  
It helps the user’s attention naturally move across the screen by creating:
- Smooth motion continuity between scroll states.
- Perceived layering through controlled blur.
- A sense of responsiveness and realism.

---

### ⚡ Performance Considerations

- All animations run with `useNativeDriver: true` to ensure GPU acceleration and 60 FPS smoothness.
- The effect parameters (blur intensity and timing) were tuned to balance performance on mid-range Android devices and maintain fluidity on iOS.
- Heavy animation libraries (like Reanimated or Lottie) were intentionally avoided to keep the build lightweight and dependency-free.

---

### ✅ Summary

This animation system achieves an elegant and responsive user experience using **built-in React Native tools** only.  
The combination of **Animated API** and **BlurView** delivers a performant, minimal, and visually refined result consistent with the project’s design and motion guidelines.

## 🔗 Deep Linking — Overview & Testing

The application fully supports **deep linking**, allowing external URLs to open the app directly on a specific show’s detail page.  
This enables seamless navigation both when the app is running and when it is launched from an external source.

---

### 📱 How It Works

- Deep links use the custom URL scheme format:  
  **`myapp://show/:id`**
- When such a link is opened:
  - If the app is **closed**, it automatically launches and navigates to the corresponding show’s detail screen.
  - If the app is **already open**, it navigates instantly without reloading the app or losing context.
- The linking configuration maps these URLs directly to the appropriate navigation routes in the app.
- The deep linking system works consistently across both **Android** and **iOS** platforms.

---

### 🧭 Testing Instructions

To test the deep linking feature:

1. **Ensure the app is installed** and running at least once on your emulator or physical device.  
2. **Use a deep link URL** in the format `myapp://show/ID` (where `ID` is a valid show ID).  
3. Open the link either:
   - From the Android command line using ADB.
   - From Safari or terminal in iOS Simulator.
4. The app should open directly into the details page of the selected show, regardless of whether it was previously open or closed.

---

### 🧠 Summary

The deep linking system in *Movie Explorer* provides a robust and user-friendly way to access specific content directly.  
It enhances navigation flow, supports cold and warm app starts, and ensures consistent cross-platform behavior — fully meeting the deliverables required for the project.
