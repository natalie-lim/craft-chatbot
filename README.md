# Task Manager

A Firebase-authenticated, real-time, and drag-and-drop task manager built with React, Next.js, styled using Tailwind CSS, and maintained using Firebase Firestore. Customize your workflow, edit task column headers, and receive task content generated with tones ranging from flattering to mean af.

Modern task management with a touch of personality.

Check it out here: [https://task-manager-4f8be.web.app/]!

---
## Approach/Process

I first started with more of what I knew, making mock-ups in figma and rendering it with a frontend tech stack. I was lucky that hello-pangea/dnd had a wonderful drag-and-drop example I riffed off of. That was actually harder than I expected, but I finished that first. I had a great time overall and was very happy with the way it turned out, especially with the color changing headers. Then, I had to find a way for the data to be represented in the backend. I decided on one document per user within the collection on Firestore. Within that document I stored data about the person, the most important piece of data being the map that stored the state of the kanban board. It was a map where the keys were ints. I made the keys ints to guarantee the order in which the different types of tasks would render. Otherwise they would be sorted according to arbitrary orders if the header value changed. Within each value, I stored the hexCode of the header, the header description, and the various tasks under that header. That way, I could load all the necessary information from and to firestore when changes occured. This was such a mess, to be frank. There were a lot of issues with data persistance and data being wiped out. However, once I got passed that part, the rest was smooth sailing. I simply made some UI tweaks and added the chatBot element. 

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