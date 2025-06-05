# Task Manager

A Firebase-authenticated, real-time, and drag-and-drop task manager built with React, Next.js, styled using Tailwind CSS, and maintained using Firebase Firestore. Customize your workflow, edit task column headers, and receive task content generated with tones ranging from flattering to bitchy.

Modern task management with a touch of personality.

Check it out here: 

---

## Features

- **Google Sign-In using Firebase Authentication** - Secure one-click authentication
- **User-specific task data** stored in Firestore under `userInfo/{uid}` - Personal workspace for each user
- **Drag and drop tasks** across dynamically generated columns with `@hello-pangea/dnd` 
- **Editable column headers** with color pickers - Fully customizable workflow columns
- **Task content generated** based on selected tone and word count - AI-powered content with adjustable personality
- **Real-time data sync** with Firestore using `onSnapshot` - Live updates across all devices
- **Sliders to control "meanness" and "word count"** - Fine-tune generated content style and length
- **Informational popup** with labeled icons - Built-in help system for UI elements

---

## Folder Structure

```
/src
  /app
    /taskpage
      - page.js         ← Main drag-and-drop logic
      - TypeTaskHeader  ← Editable headers with color support
      - Task            ← Individual task logic + generation
      - IconList        ← Renders icon legend for popup
    TypingText.js       ← Animated typing title
/firebaseConfig.js      ← Firebase setup
/public/assets          ← Icon .svg files
```

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

Clone the repository:

```bash
git clone <your-repo-url>
cd task-manager
```

Install dependencies:

```bash
npm install
```

### Firebase Configuration

Create a Firebase project at the [Firebase Console](https://console.firebase.google.com/) and update `firebaseConfig.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

**Required Firebase Setup:**
1. Enable Authentication with Google provider
2. Create a Firestore database
3. Configure security rules for user data access

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Tech Stack

- **Next.js** - React framework for production
- **Firebase Firestore** - NoSQL database for real-time data
- **Firebase Authentication** - User authentication and management
- **@hello-pangea/dnd** - Drag and drop functionality
- **Tailwind CSS** - Utility-first CSS framework
- **react-colorful** - Color picker components
- **reactjs-popup** - Modal and popup components
- **Google Fonts (Space Grotesk)** - Typography

---