# 🚀 YouTube + Twitter Backend

## 📌 Introduction

This is a **YouTube + Twitter backend project** that combines core functionalities of both platforms.
It allows users to upload videos, interact through tweets, like/comment on content, and manage their channels.

The project is built with a scalable backend architecture using modern technologies like **Node.js, Express, MongoDB, and JWT authentication**.

---

## 🔗 Important Links

| Content           | Link                                                       |
| ----------------- | ---------------------------------------------------------- |
| API Documentation | https://documenter.getpostman.com/view/28570926/2s9YsNdVwW |
| Database Model    | https://app.eraser.io/workspace/Tapxd72PB4dyZlIniDH7       |

---

## ✨ Features

### 👤 User Management

* User registration and login (JWT authentication)
* Secure logout functionality
* Profile management (avatar, cover image, user details)
* Watch history tracking

---

### 🎥 Video Management

* Upload and publish videos
* Edit and delete videos
* Video listing with search and pagination

---

### 🐦 Tweet (Post) Management

* Create and publish tweets
* View user tweets
* Update and delete tweets

---

### 👍 Like System

* Like and unlike videos, tweets, and comments
* View liked content

---

### 💬 Comment System

* Add comments on videos
* Update and delete comments

---

### 📺 Subscription System

* Subscribe and unsubscribe to channels
* View subscriber and subscribed lists

---

### 📂 Playlist Management

* Create, update, and delete playlists
* Add/remove videos to playlists
* View playlists

---

### 📊 Dashboard

* View channel statistics (videos, likes, subscribers, views)
* Manage uploaded content

---

### ❤️ Health Check

* API endpoint to verify server status

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* JWT (Authentication)
* Cloudinary (for media storage)

---

## 📂 Project Structure

```
Backend/
│── controllers/
│── models/
│── routes/
│── middleware/
│── utils/
│── config/
│── app.js / server.js
│── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Vipinsinghhh/Backend.git
```

### 2️⃣ Navigate to project folder

```bash
cd Backend
```

### 3️⃣ Install dependencies

```bash
npm install
```

### 4️⃣ Setup environment variables

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGODB_URI=your_mongodb_connection
ACCESS_TOKEN_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 5️⃣ Run the server

```bash
npm run dev
```

---

## 🧪 API Testing

You can test APIs using:

* Postman
* Thunder Client

---

## 🚀 Future Improvements

* Real-time notifications
* Video streaming optimization
* Advanced search & recommendation system
* Frontend integration

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 👨‍💻 Author

**Vipin Singh**
GitHub: https://github.com/Vipinsinghhh

---

## ⭐ Support

If you found this project helpful, give it a ⭐ on GitHub!
