# 💬 WhatsApp Web Clone (MERN + WebRTC)

A full-stack real-time chat application inspired by WhatsApp Web, featuring messaging, group chats, file sharing, and peer-to-peer audio/video calling.

---

## 🚀 Features

### 💬 Messaging
- One-to-one real-time chat
- Group chat support
- Instant message delivery using WebSockets

### 🟢 Presence & Activity
- Online/offline status
- Typing indicators

### 📞 Calling
- Audio calling using WebRTC
- Video calling using WebRTC
- Peer-to-peer connection for low latency communication

### 📁 File Sharing
- Upload and send files/media
- Cloud storage integration (Cloudinary)

### 🔐 Authentication & Security
- JWT-based authentication
- Protected routes and secure APIs

### 🎨 UI/UX
- Responsive WhatsApp-like interface
- Dark mode support
- Built with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)

### Real-Time Communication
- Socket.io (WebSockets)
- WebRTC (Audio/Video calls)

---

## 📂 Project Structure

```
whats_app_project/
│
├── backend/
│   ├── src/
│   │   ├── configs/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   │
│   │   ├── app.js
│   │   ├── index.js
│   │   └── SocketServer.js
│   │
│   ├── .gitignore
│   ├── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json   # or yarn.lock (only one)
│   ├── tailwind.config.js
│
└── README.md
```
---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/whatsapp_project.git
cd whatsapp_project
```

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd client
npm install
npm start
```

---

## 📸 Screenshots

Register Page:

<img width="1897" height="880" alt="Register" src="https://github.com/user-attachments/assets/bbb9a8c9-7a27-4563-a728-cbf1fa0236c4" />


Login Page: 

<img width="1897" height="880" alt="Register" src="https://github.com/user-attachments/assets/6f01069e-151c-4775-be92-19a077c45ce8" />

Create new chat:

<img width="1920" height="882" alt="creating user" src="https://github.com/user-attachments/assets/de14f8cc-8a6b-4147-b6c4-0e1ba86252f3" />

One-to-one chat:

<img width="1920" height="835" alt="images and files" src="https://github.com/user-attachments/assets/eeb58bf1-05c3-4217-996b-94574750f46a" />

Group chat:

<img width="1883" height="843" alt="group chat" src="https://github.com/user-attachments/assets/7bb094d0-ef3d-4c57-92ca-9cd139131314" />

Video call:

<img width="1885" height="843" alt="videocall1" src="https://github.com/user-attachments/assets/c67b50f8-c8f1-4f37-a152-bf7d902d81f1" />

Audio call:

<img width="1871" height="844" alt="audiocall" src="https://github.com/user-attachments/assets/86fa2c65-6825-4f2f-8a36-eb625aa59ffb" />

---

## 🧠 Key Concepts

- Real-time communication using Socket.io
- Peer-to-peer media streaming using WebRTC
- State management using Redux Toolkit
- RESTful API design
- Secure authentication using JWT
- File handling and cloud uploads

---



## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---

## 🧑‍💻 Author

Priyanka Prajapati,
Muthyala Srivalli
