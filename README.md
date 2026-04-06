💬 WhatsApp Web Clone (MERN + WebRTC)

A full-stack real-time chat application inspired by WhatsApp Web, featuring messaging, group chats, file sharing, and peer-to-peer audio/video calling.

🚀 Features
💬 Messaging
One-to-one real-time chat
Group chat support
Instant message delivery using WebSockets
🟢 Presence & Activity
Online/offline status
Typing indicators
📞 Calling
Audio calling using WebRTC
Video calling using WebRTC
Peer-to-peer connection for low latency communication
📁 File Sharing
Upload and send files/media
Cloud storage integration (Cloudinary)
🔐 Authentication & Security
JWT-based authentication
Protected routes and secure APIs
🎨 UI/UX
Responsive WhatsApp-like interface
Dark mode support
Built with Tailwind CSS
🛠️ Tech Stack
Frontend
React.js
Redux Toolkit
Tailwind CSS
Backend
Node.js
Express.js
MongoDB
JWT (JSON Web Tokens)
Real-Time Communication
Socket.io (WebSockets)
WebRTC (Audio/Video calls)
📂 Project Structure
client/
  ├── src/
  │   ├── components/
  │   ├── features/
  │   ├── pages/
  │   ├── redux/
  │   └── utils/

server/
  ├── controllers/
  ├── models/
  ├── routes/
  ├── services/
  └── socket/
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/whatsapp_project.git
cd whatsapp_project
2️⃣ Setup Backend
cd server
npm install

Create a .env file in server/:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUD_NAME=your_cloudinary_name
CLOUD_SECRET=your_cloudinary_secret

Run backend:

npm run dev
3️⃣ Setup Frontend
cd client
npm install
npm start
🔌 Environment Variables
Variable	Description
MONGO_URI	MongoDB connection string
JWT_SECRET	Secret for JWT authentication
CLOUD_NAME	Cloudinary name
CLOUD_SECRET	Cloudinary secret
📸 Screenshots

Add your UI screenshots here

🧠 Key Concepts
Real-time communication using Socket.io
Peer-to-peer media streaming using WebRTC
State management using Redux Toolkit
RESTful API design
Secure authentication using JWT
File handling and cloud uploads
🚧 Future Improvements
Message reactions 👍
Read receipts (✔✔)
Push notifications
Screen sharing in calls
Better mobile responsiveness
🤝 Contributing

Contributions are welcome! Feel free to fork and submit a pull request.

📄 License

This project is licensed under the MIT License.

⭐ Support

If you like this project, give it a ⭐ on GitHub!

🧑‍💻 Author

Priyanka Prajapati
