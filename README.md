# 🏛️ BharatVirasat — Living Cultural Heritage & Student Innovation Platform
> **Problem Statement & Vision**: Student Innovation-Ideas that showcase the rich cultural heritage and traditions of India — celebrating maximum states, monuments, UNESCO world heritage sites, traditional crafts, folk dance, classical music, and ancient architecture through modern interactive technology.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

---

## ✨ Key Platform Highlights

1. **🏛️ 32 Documented UNESCO World Heritage Monuments of Bharat**:
   - 100% verified photography matching the official architectural monuments.
   - Comprehensive **4-Tab Historical Dossiers**: Imperial Dynasties, Monarchs, Chronology Timelines, Structural Engineering Secrets, Sacred Lore, and Eyewitness World Traveler Chronicles (Xuanzang, Domingo Paes, Ibn Battuta, Marco Polo, Bernier).
2. **🌌 Living Monument Panoramic Background**:
   - Replaced dark backgrounds with high-definition Ken Burns animated monument crossfades (Konark, Taj Mahal, Hampi, Kailasa, Brihadisvara, Chittorgarh), floating diya embers, rotating Surya Chakra, and dismissible controls.
3. **🎥 Full-Screen Monument Cinema Mode (पूर्ण स्क्रीन दृश्य)**:
   - Full-viewport slideshow with text overlay hide/show toggle (`Eye`/`EyeOff`, shortcut **`H`** / **`T`**), autoplay controls, thumbnail bar, and keyboard navigation.
4. **🪔 Procedural Indian Classical Soundtrack**:
   - Browser-native Web Audio Tanpura drone and authentic resonant temple bell chimes toggled on/off (`Volume2`/`VolumeX`, shortcut **`M`**). Zero external downloads required.
5. **🎓 Student Innovation & Heritage Explorer Login Portal**:
   - Student Innovation Pass authentication, role selection (Student Innovator, Heritage Scholar), profile badge achievements, and 1-click evaluator demo logins.
6. **🪐 Interactive 3D Archaeo-Astronomy Sanctums**:
   - WebGL / Three.js 3D models with daylight slider simulating sun positions on temple spires.
7. **📷 AI Heritage Lens & Camera**:
   - Real-time device camera capture and Gemini AI visual artifact identification.
8. **🔊 Dual-Channel Spoken Audio Guides**:
   - Narration with synchronized live subtitle teleprompters.
9. **🗺️ Pan-India Explorer & Crafts Treasury**:
   - State-by-state crafts, GI tags, artisan profiles, folk dance, and music traditions across India.

---

## 💻 Step-by-Step Guide: How to Open & Run in VS Code

### Step 1: Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Click on **File** -> **Open Folder...** (or press `Ctrl + K`, `Ctrl + O`).
3. Navigate to the project directory:
   ```
   C:\Users\Asus\OneDrive\Attachments\Documents\project
   ```
4. Click **Select Folder**.

*(Alternatively, open your Windows Command Prompt / PowerShell, navigate to the folder, and type `code .` to launch VS Code directly).*

---

### Step 2: Open Terminal in VS Code
Press `Ctrl + `` (tilde) or go to **Terminal** -> **New Terminal** in the top menu bar.

---

### Step 3: Install Node.js Dependencies
If you ever move this project to another machine or need to reinstall packages, run:
```bash
npm install
```
*(All required dependencies: React, TypeScript, Three.js, Lucide-React, Tailwind CSS, and Vite will be installed automatically).*

---

### Step 4: Run the Development Server
In the VS Code terminal, run:
```bash
npm run dev
```
Vite will start the local development server in less than 500ms:
```
  VITE v5.4.8  ready in 420 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
Hold `Ctrl` and click the link **`http://localhost:5173/`** in the terminal to view your platform in the browser!

---

### Step 5: Test & Verify the Production Build
To check for any TypeScript errors and create the optimized production bundle:
```bash
# 1. Typecheck:
npm run typecheck

# 2. Build production assets:
npm run build

# 3. Preview production build locally:
npm run preview
```

---

## 📁 Project Architecture & File Directory

```
project/
├── index.html                           # App entry HTML template
├── package.json                         # Dependencies & project scripts
├── tsconfig.json / tsconfig.app.json    # TypeScript configurations
├── vite.config.ts                       # Vite bundler configuration
├── tailwind.config.js                   # Tailwind CSS themes & animations
├── .env.example                         # Optional API keys template
│
└── src/
    ├── main.tsx                         # React entrypoint
    ├── App.tsx                          # App root, persistent audio player & router
    ├── index.css                        # Global design system & animations
    │
    ├── components/
    │   ├── Navbar.tsx                   # Top navigation with Student Pass & Points
    │   ├── Footer.tsx                   # Heritage footer & quick links
    │   ├── MonumentAnimatedBackground.tsx# Living Ken Burns monument backdrop
    │   ├── Monument3DViewer.tsx         # Three.js WebGL 3D virtual sanctum
    │   └── HeritageAudioPlayer.tsx      # Dual-channel audio guide & live subtitles
    │
    ├── pages/
    │   ├── HomePage.tsx                 # Landing showcase & state grid
    │   ├── UnescoPage.tsx               # 32 UNESCO sites, full cinema & soundscape
    │   ├── LoginPage.tsx                # Student Innovation Pass & Demo Logins
    │   ├── ExplorePage.tsx              # Pan-India interactive state & craft explorer
    │   ├── StateDetailPage.tsx          # Comprehensive state heritage profile
    │   ├── CraftDetailPage.tsx          # Step-by-step craft creation & GI history
    │   ├── ArtisansPage.tsx             # Living national master artisan directory
    │   ├── IdentifyPage.tsx             # AI camera lens for monument & craft recognition
    │   ├── AskBharatPage.tsx            # AI cultural tutor & interactive Q&A
    │   ├── ReelsPage.tsx                # Short-form cultural video stories
    │   ├── QuizPage.tsx                 # Gamified cultural quiz & points
    │   ├── JourneyPage.tsx              # Curated heritage travel trails
    │   ├── ComparePage.tsx              # Side-by-side temple & craft comparison
    │   └── NearMePage.tsx               # Geolocation monuments & crafts near you
    │
    ├── data/
    │   ├── unescoMonuments.ts           # 32 Verified UNESCO monuments with real images
    │   ├── monumentHistoricalProfiles.ts# Dynasties, timelines, engineering secrets & lore
    │   ├── states.ts                    # Complete state-by-state heritage database
    │   ├── crafts.ts                    # GI crafts & traditional manufacturing steps
    │   ├── artisans.ts                  # Master craftspeople & community profiles
    │   ├── innovations.ts               # Student innovation project ideas
    │   ├── quiz.ts                      # Multi-category cultural trivia questions
    │   └── types.ts                     # Core TypeScript interfaces
    │
    ├── hooks/
    │   ├── useAuth.ts                   # Student Innovation user state & demo logins
    │   ├── useRouter.ts                 # Clean hash-based client-side router
    │   └── useProgress.ts               # Gamified points & badges tracking
    │
    └── lib/
        ├── gemini.ts                    # Google Gemini AI integration with offline fallback
        └── supabase.ts                  # Supabase cloud database client
```

---

## 🐙 Step-by-Step Guide: How to Push to GitHub

To push your repository to your GitHub profile from VS Code:

1. Create a new repository on [GitHub](https://github.com/new) named `bharatvirasat` (leave "Initialize with README" unchecked).
2. Open the terminal in VS Code and run:
   ```powershell
   # 1. Connect your GitHub repository as the remote origin
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

   # 2. Ensure default branch is main
   git branch -M main

   # 3. Push all commits to GitHub
   git push -u origin main
   ```
3. All code, commits, and assets will now be live on your GitHub profile!

---

## 🛡️ License & Acknowledgements
- Developed for the **National Student Innovation & Cultural Heritage Showcase of Bharat**.
- Inscribed Monument data sourced from official **UNESCO World Heritage Records** and the **Archaeological Survey of India (ASI)**.
