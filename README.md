# 🎬 StreamVault — OTT Streaming Platform

StreamVault is a full-stack OTT (Over-The-Top) streaming web application that allows users to browse, search, and watch movies & series, with an admin panel for content management and AWS S3 integration for media storage.

---

## 🚀 Features

### 👤 User Features

* 🔐 Authentication (Login / Register with JWT)
* 🎥 Watch Movies & Series
* 📺 Season & Episode-based streaming
* 🔍 Real-time search (movies + series)
* ❤️ Add to Watchlist
* ▶️ Continue Watching
* 🧠 Personalized recommendations (basic)
* 👤 Profile & account management

---

### 🛠️ Admin Features

* 📤 Upload Movies & Series
* 🖼️ Upload thumbnails & banners (AWS S3)
* 🎞️ Upload video content (S3 integration)
* 📊 Dashboard (users, views, content stats)
* 🧩 Manage content (edit/delete/publish/draft)
* 👥 User management

---

## 🧱 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

### Backend

* Spring Boot (Java)
* Maven
* JWT Authentication
* REST APIs

### Database

* MySQL

### Cloud & Storage

* AWS S3 (media storage)
* (Optional) CloudFront (CDN)

---

## 📁 Project Structure

```
/frontend        → React application
/backend         → Spring Boot API
/database        → SQL schema & scripts
/tests           → API & E2E tests
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Karthickcjx/OTT.git
cd OTT
```

---

### 2️⃣ Backend Setup (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

📍 Runs on: `http://localhost:8080`

---

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

📍 Runs on: `http://localhost:5173`

---

### 4️⃣ Database Setup (MySQL)

* Create database:

```sql
CREATE DATABASE streamvault;
```

* Update credentials in:

```
application.properties
```

---

### 5️⃣ AWS S3 Configuration

* Create S3 bucket
* Add credentials in backend config
* Set bucket policy OR use pre-signed URLs

Example bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

---

## 🔑 API Endpoints (Sample)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/me`

### Movies & Series

* `GET /api/movies`
* `GET /api/series`
* `GET /api/watch/{id}`

### Admin

* `POST /api/upload`
* `POST /api/movies`
* `POST /api/series`

---

## 🧪 Testing

### API Tests

```bash
npm run test:api
```

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

---

## ⚠️ Known Issues

* Video playback requires correct S3 permissions
* Search requires proper backend integration
* Large video uploads need increased file size limits

---

## 🔮 Future Enhancements

* 🎥 HLS Streaming (.m3u8)
* ⚡ CloudFront CDN integration
* 🤖 AI-based recommendations
* 👶 Kids Mode
* 🌐 Multi-language support
* 📱 Mobile responsiveness improvements

---

## 👨‍💻 Author

**Karthick Raja**

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 🛠️ Contribute

---

## 💡 Inspiration

Inspired by platforms like Netflix, Amazon Prime Video, and modern OTT systems.

---
