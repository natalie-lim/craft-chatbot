# Craft Chatbot

### Video Demo:
https://www.loom.com/share/fd38add23d394a98868643bcf2eac9dc 

A Firebase-authenticated, real-time chatbot application built with React, Next.js, and Tailwind CSS.  
The bot leverages an LLM API to stay on-topic around crafts (knitting, crochet, sewing, etc.) and can also act as a **negotiation partner** for bartering materials, patterns, and finished projects. Because of firebase, it also keeps track of negotiation offers in the past.

---

## Why OpenAI

I used OpenAI’s API because it’s the easiest and most reliable way to get high-quality, on-topic responses, and
also I didn't know what I wanted my chatbot to be at first, so I decided to choose the most versatile.

---

## Features

- **Google Sign-In using Firebase Authentication** – secure one-click authentication
- **User-specific data in Firestore** (`userInfo/{uid}`) – stores profile info + chat/offer history
- **LLM integration** – calls an API (OpenAI/Anthropic/etc.) to generate context-aware responses
- **Negotiation mode** – bot proposes and counters offers while remembering latest amounts
- **Conversation history** – state passed into each prompt to maintain context
- **UI Tabs** – switch between live negotiation and past history
- **Real-time sync** – Firestore `onSnapshot` keeps data consistent across devices
- **Customizable styles** – Tailwind classes with themed colors and animated typing text

---

## Extra Credit
I implemented:
- **Negotiation-Oriented Dialogue**: you can trade patterns, yarn, needles, etc
- **State Management**: Implemented a mechanism for persistent storage of conversation history and/or track structured data (e.g., current offers, agreed terms), just switch tabs on the navigation bot, used firebase
- **UI Enhancements**: Visualize the negotiation process with the chatbot visuals

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/natalie-lim/craft-chatbot
cd craft-chatbot
npm install

### 2. Check your email for the onetime secret to set up your .env.local
OPENAI_API_KEY=your-openai-key
LLM_PROVIDER=openai
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

### 3. Run it in terminal
npm run dev
```
