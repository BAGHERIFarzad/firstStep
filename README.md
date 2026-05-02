# </> FirstStep — AI-Powered Code Analysis

> **IBM Bob Dev Day Hackathon 2026** — Built with IBM Bob

FirstStep helps **anyone** understand any codebase instantly — from senior developers drowning in legacy code to junior developers just starting out.

---

## 🎯 The Problem

Meet **Henri**, 72, a retired teacher learning to code. He opens his grandson's GitHub project and is completely lost.

Meet **Amina**, 44, a bakery owner whose developer left behind undocumented code. She has no idea what it does.

Every developer knows this pain too — joining a new team, inheriting old code, or opening someone else's project. It can take **days** to understand what the code does.

**FirstStep solves this in 30 seconds.**

---

## ✨ What It Does

Paste any code → Select the language → Get instant AI analysis:

- 📖 **Plain English Summary** — What does this code actually do?
- 🔍 **Components Breakdown** — Key functions, classes, and their purpose
- ✅ **Suggested Tests** — 3 ready-to-use test cases
- 📝 **Auto Documentation** — Markdown documentation generated instantly
- 📤 **Export** — Save as PDF or Markdown
- 🌙 **Dark/Light Mode** — Easy on the eyes
- 🕐 **History** — All your previous analyses saved locally

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| AI | Claude (Anthropic API) |
| Database | SQLite |
| Built With | **IBM Bob IDE** |

---

## 📁 Project Structure

```
firstStep/
├── backend/
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── chat.js           # Code analysis routes
│   ├── anthropic.js          # Claude AI integration
│   ├── constants.js          # Configuration
│   ├── database.js           # SQLite setup
│   ├── server.js             # Main server
│   ├── simple-server.js      # Simplified server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── CodeInput.tsx
│   │   │   ├── Results.tsx
│   │   │   └── HistorySidebar.tsx
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── utils/
│   │   │   └── exportUtils.ts
│   │   ├── App.tsx
│   │   └── types.ts
│   └── package.json
├── .gitignore
├── FRONTEND_GUIDE.md
├── PROJECT_PLAN.md
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Anthropic API key — get one free at [console.anthropic.com](https://console.anthropic.com)

### Installation

**Step 1 — Clone the repo:**
```bash
git clone https://github.com/BAGHERIFarzad/firstStep.git
cd firstStep
```

**Step 2 — Setup backend:**
```bash
cd backend
npm install
```

**Step 3 — Create your `.env` file inside the `backend/` folder:**
```
ANTHROPIC_API_KEY=your_key_here
PORT=3001
```
> ⚠️ Never commit this file — it's already in `.gitignore`

**Step 4 — Start the backend:**
```bash
node simple-server.js
```

**Step 5 — Setup frontend (open a new terminal):**
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 🤖 How IBM Bob Was Used

IBM Bob was the **primary development partner** for this entire project:

- ✅ Generated complete backend architecture and all API routes
- ✅ Built entire React frontend with all components
- ✅ Created SQLite database schema and operations
- ✅ Wrote Claude AI integration service
- ✅ Implemented dark/light theme system
- ✅ Built PDF and Markdown export functionality
- ✅ Fixed bugs and suggested improvements throughout
- ✅ Generated all project documentation

See the exported **IBM Bob session report** in the repository for complete session history.

---

## 🏆 Hackathon

| | |
|---|---|
| **Event** | IBM Bob Dev Day Hackathon 2026 |
| **Theme** | Turn idea into impact faster with IBM Bob |
| **Deadline** | May 3, 2026 — 10:00 AM ET |

---

## 👥 Meet the Characters

**Henri** — 72 years old, retired teacher, learning to code. Opens complex repositories and feels lost. FirstStep gives him clarity in seconds.

**Amina** — 44 years old, bakery owner, inherited undocumented code from her developer. FirstStep helps her understand what she owns.

---

Built with ❤️ using **IBM Bob** — *Your AI-powered development partner*
