# Chit-Chat

> A real-time messaging application built with React, Node.js, MongoDB and Socket.IO.

A full-stack chat application focused on real-time communication, authentication, media handling and modern React state management.

## ✨ Features

- 💬 Real-time messaging with Socket.IO
- 🔐 Authentication and protected routes
- 👤 User management
- 🖼️ Image/media handling with Cloudinary
- 🔔 Toast notifications
- ⚡ Fast React frontend with Vite
- 🧠 Zustand for client-side state management
- 📱 Responsive UI

## 🛠️ Tech Stack

### Frontend

**React 19 · Vite · Tailwind CSS · DaisyUI · Zustand · Axios · Socket.IO Client**

### Backend

**Node.js · Express · MongoDB · Mongoose · Socket.IO · JWT · Cloudinary**

## 🏗️ Architecture

```text
React + Vite
     │
     │ HTTP / WebSocket
     ▼
Express + Socket.IO
     │
     ├── Authentication
     ├── Chat APIs
     ├── Real-time events
     │
     ▼
MongoDB + Cloudinary
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm run build
```

### 2. Configure environment variables

Create the required `.env` files for the backend and add your MongoDB, JWT and Cloudinary credentials.

### 3. Start the application

```bash
npm start
```

For development, run the frontend and backend development servers separately.

## 📁 Project Structure

```text
fullstack-chat-app/
├── backend/
│   └── src/
├── frontend/
│   └── src/
├── package.json
└── README.md
```

## 🎯 Why I Built This

I built this project to understand how a production-style full-stack application connects the frontend, backend, database and real-time communication layer into one system.

## 👨‍💻 Author

**Shiva Infinity**

AI/ML Builder • Full-Stack Developer • Product Builder

[GitHub](https://github.com/Shivainfinity12)
