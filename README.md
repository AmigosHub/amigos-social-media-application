# 🚀 Amigos – Social Media Platform

> A production-ready full-stack social media platform built with **React, Spring Boot, ASP.NET Core, and MySQL**, featuring real-time chat, notifications, JWT authentication, social interactions, and an admin dashboard with analytics.

## 🌐 Live Application

| Service                       | Link                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| 🌐 **React Frontend**         | [Open Application](https://social-app-test-coral.vercel.app/)                                       |
| ☕ **Java Spring Boot API**    | [Swagger UI](https://social-media-java-backend.onrender.com/swagger-ui/index.html)                  |
| 🔷 **ASP.NET Core Admin API** | [Swagger UI](https://social-media-admin-backend.onrender.com/swagger/index.html)                    |
| 📦 **GitHub Repository**      | [Amigos Social Media Application](https://github.com/AmigosHub/amigos-social-media-application.git) |

---

## 📋 Table of Contents

* [Project Overview](#-project-overview)
* [Key Highlights](#-key-highlights)
* [Features](#-features)
* [Technology Stack](#️-technology-stack)
* [System Architecture](#️-system-architecture)
* [Database Schema](#️-database-schema)
* [API Documentation](#-api-documentation)
* [Frontend File Division](#-frontend-file-division-by-member)
* [Installation & Setup](#-installation--setup)
* [Environment Variables](#-environment-variables)
* [Deployment](#-deployment)
* [Project Structure](#-project-structure)
* [Team Integration](#-team-integration)
* [Project Statistics](#-project-statistics)
* [Contributors](#-contributors)
* [License](#-license)

---

# 📖 Project Overview

**Amigos** is a full-stack social media application that allows users to connect, share content, communicate in real time, and interact with other users.

The project follows a **dual-backend architecture**:

* **React + Vite** → Frontend
* **Spring Boot** → User-facing APIs
* **ASP.NET Core 8** → Admin APIs
* **MySQL** → Shared database
* **Cloudinary** → Image and video storage
* **WebSocket/STOMP** → Real-time communication
* **JWT** → Authentication and authorization

The application is deployed using **Vercel, Render, and Aiven**.

---

# 🎯 Key Highlights

* 🔐 JWT-based authentication and authorization
* 👤 Complete user profile management
* 📝 Post creation, editing, deletion, likes, comments, and saved posts
* 👥 Follow and unfollow functionality
* 💬 Real-time one-to-one chat
* 🔔 Real-time notifications
* 🔎 User and post search
* 🚨 User and content reporting
* 📊 Admin dashboard with analytics
* 👨‍💼 Admin user and report management
* ☁️ Cloudinary-based media storage
* 📱 Responsive React UI
* 🏗️ Dual-backend architecture
* 🌐 Cloud deployment using Vercel, Render, and Aiven

---

# ✨ Features

## 👤 User Features

| Feature               | Description                                      |
| --------------------- | ------------------------------------------------ |
| 🔐 Authentication     | Register, login, logout, JWT authentication      |
| 👤 Profile Management | View and update profile information              |
| 🖼️ Profile Picture   | Upload and remove profile pictures               |
| 📝 Posts              | Create, edit, and delete posts                   |
| 🖼️ Media Upload      | Upload images and videos using Cloudinary        |
| 💬 Comments           | Add comments and replies                         |
| ❤️ Likes              | Like and unlike posts                            |
| 👥 Follow System      | Follow/unfollow users and manage follow requests |
| 🔖 Saved Posts        | Save posts for later                             |
| 💬 Real-Time Chat     | One-to-one messaging using WebSocket             |
| ✍️ Typing Indicator   | Real-time typing status                          |
| ✓ Read Receipts       | Track message read status                        |
| 🔔 Notifications      | Notifications for social interactions            |
| 🔎 Search             | Search for users and posts                       |
| 🚨 Reports            | Report users, posts, and comments                |
| 🚫 Blocking           | Block and unblock users                          |
| ⚙️ Settings           | Manage user preferences                          |

## 👨‍💼 Admin Features

| Feature              | Description                                        |
| -------------------- | -------------------------------------------------- |
| 📊 Dashboard         | Platform statistics and overview                   |
| 📈 Analytics         | User, post, comment, message, and report analytics |
| 👥 User Management   | View, search, activate, deactivate, and ban users  |
| 🚨 Report Management | Review, resolve, and dismiss reports               |
| 📋 User Details      | View detailed user information                     |
| 📊 Charts            | Visual representation of platform statistics       |

---

# 🛠️ Technology Stack

## ⚛️ Frontend

| Technology    | Version | Purpose                |
| ------------- | ------: | ---------------------- |
| React         |  19.2.6 | UI Framework           |
| React Router  |  7.11.0 | Routing and navigation |
| Material UI   |   9.2.0 | UI components          |
| Axios         |  1.17.0 | HTTP client            |
| Recharts      |  3.10.1 | Charts and analytics   |
| Framer Motion | 12.40.0 | Animations             |
| date-fns      |   4.4.0 | Date utilities         |
| Vite          |  8.0.12 | Build tool             |

## ☕ Java Backend – Spring Boot

| Technology       | Version | Purpose                          |
| ---------------- | ------: | -------------------------------- |
| Spring Boot      |   4.0.7 | Backend framework                |
| Spring Web       |   4.0.7 | REST APIs                        |
| Spring Security  |   4.0.7 | Authentication and authorization |
| Spring Data JPA  |   4.0.7 | Database access / ORM            |
| Hibernate        |  7.2.19 | ORM implementation               |
| Spring WebSocket |   4.0.7 | Real-time communication          |
| JJWT             |  0.12.6 | JWT generation and validation    |
| Cloudinary       |  1.38.0 | Media storage                    |
| ModelMapper      |   3.2.2 | DTO/entity mapping               |
| Lombok           | 1.18.30 | Boilerplate reduction            |
| MySQL Connector  |   9.7.0 | MySQL database connectivity      |

## 🔷 ASP.NET Core Admin Backend

| Technology      | Version | Purpose                  |
| --------------- | ------: | ------------------------ |
| ASP.NET Core    |     8.0 | Admin API framework      |
| JWT Bearer      |   8.0.0 | JWT authentication       |
| Pomelo MySQL    |   8.0.0 | MySQL / EF Core provider |
| Serilog         |   8.0.0 | Structured logging       |
| Swashbuckle     |   6.6.2 | Swagger/OpenAPI          |
| Newtonsoft.Json |  13.0.3 | JSON serialization       |

## 🗄️ Database & Cloud

| Technology | Version / Platform | Purpose                     |
| ---------- | ------------------ | --------------------------- |
| MySQL      | 8.0                | Relational database         |
| Aiven      | Cloud              | MySQL hosting               |
| Cloudinary | Cloud              | Image/video storage         |
| Vercel     | Cloud              | React frontend hosting      |
| Render     | Cloud              | Java & .NET backend hosting |

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────────┐
                         │      React Frontend      │
                         │         Vercel           │
                         └────────────┬─────────────┘
                                      │
                       ┌──────────────┴──────────────┐
                       │                             │
                       ▼                             ▼
             ┌──────────────────┐          ┌──────────────────┐
             │  Java Backend    │          │  .NET Admin API  │
             │  Spring Boot     │          │  ASP.NET Core 8  │
             │     Render       │          │      Render      │
             └────────┬─────────┘          └────────┬─────────┘
                      │                             │
                      └──────────────┬──────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  MySQL Database │
                            │      Aiven      │
                            └─────────────────┘

                      ┌───────────────────────┐
                      │      Cloudinary       │
                      │   Image / Video CDN   │
                      └───────────────────────┘

                      ┌───────────────────────┐
                      │ WebSocket / STOMP     │
                      │ Real-Time Messaging   │
                      └───────────────────────┘
```

### Backend Responsibilities

**Spring Boot Backend**

* User authentication
* User management
* Posts
* Comments
* Likes
* Follow system
* Saved posts
* Chat
* Notifications
* Reports
* Search
* WebSocket communication

**ASP.NET Core Backend**

* Admin dashboard
* Admin analytics
* User management
* Report management
* Administrative operations

---

# 🗄️ Database Schema

The application uses **12 MySQL tables**.

|  # | Table           | Description                 |
| -: | --------------- | --------------------------- |
|  1 | `users`         | User accounts and profiles  |
|  2 | `posts`         | User-generated posts        |
|  3 | `comments`      | Comments and replies        |
|  4 | `likes`         | Post likes                  |
|  5 | `follows`       | Follow relationships        |
|  6 | `saved_posts`   | Saved posts                 |
|  7 | `conversations` | Chat conversations          |
|  8 | `messages`      | Chat messages               |
|  9 | `notifications` | User notifications          |
| 10 | `reports`       | Reported content            |
| 11 | `blocked_users` | User blocking relationships |
| 12 | `user_settings` | User preferences            |

### Entity Relationships

```text
users
 ├── posts
 ├── comments
 ├── likes
 ├── follows
 ├── saved_posts
 ├── conversations
 ├── messages
 ├── notifications
 ├── reports
 ├── blocked_users
 └── user_settings

posts
 ├── comments
 ├── likes
 ├── saved_posts
 ├── notifications
 └── reports

comments
 ├── replies
 ├── notifications
 └── reports

conversations
 └── messages
```

---

# 📚 API Documentation

## ☕ Java REST APIs

| Category        | Base Path            | Endpoints |
| --------------- | -------------------- | --------: |
| Authentication  | `/auth`              |         5 |
| User Management | `/api/users`         |        13 |
| Posts           | `/api/posts`         |         8 |
| Comments        | `/api/comments`      |         8 |
| Likes           | `/api/likes`         |         5 |
| Follow          | `/api/follow`        |         9 |
| Saved Posts     | `/api/saved-posts`   |         4 |
| Chat            | `/api/chat`          |        12 |
| Notifications   | `/api/notifications` |         7 |
| Reports         | `/api/reports`       |         6 |
| Search          | `/api/search`        |         1 |
| **Total**       |                      |    **78** |

### Java Swagger

👉 [Open Java Swagger UI](https://social-media-java-backend.onrender.com/swagger-ui/index.html)

---

## 🔷 ASP.NET Core Admin APIs

| Category        | Base Path              | Endpoints |
| --------------- | ---------------------- | --------: |
| Dashboard       | `/api/admin/dashboard` |         3 |
| Analytics       | `/api/admin/analytics` |         6 |
| User Management | `/api/admin/users`     |         9 |
| Reports         | `/api/admin/reports`   |         6 |
| **Total**       |                        |    **24** |

### .NET Swagger

👉 [Open .NET Admin Swagger UI](https://social-media-admin-backend.onrender.com/swagger/index.html)

### 📊 Total APIs

```text
Java Spring Boot APIs       : 78
ASP.NET Core Admin APIs     : 24
--------------------------------
Total REST APIs             : 102
```

---

# 👥 Frontend File Division by Member

The frontend development was divided among **four team members** based on application modules.

## 🧑‍💻 Member 1 – User & Authentication

```text
src/api/
├── auth.js
├── user.js
└── axios.js

src/context/
└── AuthContext.jsx

src/components/common/
├── Header.jsx
├── Sidebar.jsx
├── PrivateRoute.jsx
├── LoadingSpinner.jsx
└── LoadingSkeleton.jsx

src/pages/
├── Login.jsx
├── Register.jsx
├── Profile.jsx
└── Search.jsx (partial)

src/hooks/
└── useAuth.js

src/utils/
├── validators.js
└── helpers.js (partial)
```

### Responsibilities

* Authentication
* Registration and login
* User profile
* Authentication state
* Route protection
* User-related UI
* Form validation
* Common loading components

---

## 🧑‍💻 Member 2 – Social Features

```text
src/api/
├── post.js
├── comment.js
├── like.js
├── follow.js
├── savedPost.js
├── report.js
└── search.js

src/context/
├── PostContext.jsx
└── FollowContext.jsx

src/components/posts/
├── PostCard.jsx
├── PostList.jsx
└── PostSkeleton.jsx

src/components/comments/
├── CommentInput.jsx
├── CommentItem.jsx
└── CommentList.jsx

src/components/user/
├── UserCard.jsx
└── UserSearch.jsx

src/components/common/
└── ReportDialog.jsx

src/pages/
├── Home.jsx
├── CreatePost.jsx
├── EditPost.jsx
├── Following.jsx
└── Search.jsx (partial)

src/hooks/
└── useFollow.js
```

### Responsibilities

* Posts
* Comments
* Likes
* Follow/unfollow
* Saved posts
* Reports
* Search
* Social interactions
* Feed
* User search

---

## 🧑‍💻 Member 3 – Chat & Notifications

```text
src/api/
├── chat.js
└── notification.js

src/context/
├── ChatContext.jsx
└── NotificationContext.jsx

src/components/chat/
├── ChatList.jsx
└── ChatWindow.jsx

src/pages/
├── Chat.jsx
└── Notifications.jsx

src/socket/
├── socket.js
└── socketEvents.js

src/hooks/
├── useChat.js
└── useSocket.js

src/utils/
└── dateFormatter.js
```

### Responsibilities

* Real-time chat
* WebSocket/STOMP
* Notifications
* Typing indicators
* Read receipts
* Chat state management
* Notification state management

---

## 🧑‍💻 Member 4 – Admin & Analytics

```text
src/api/
├── admin.js
└── adminAxios.js

src/context/
└── AdminContext.jsx

src/components/admin/
├── AdminLayout.jsx
├── AdminSidebar.jsx
├── AdminHeader.jsx
├── DashboardStats.jsx
├── DashboardCharts.jsx
├── AnalyticsView.jsx
├── UserManagement.jsx
├── UserDetailDialog.jsx
├── BanUserDialog.jsx
├── ReportManagement.jsx
└── ReportDetailDialog.jsx

src/pages/admin/
├── AdminDashboard.jsx
├── AdminUsers.jsx
├── AdminReports.jsx
└── AdminAnalytics.jsx

src/routes/
└── AdminRoutes.jsx

src/utils/
└── cache.js
```

### Responsibilities

* Admin dashboard
* Analytics
* User management
* User banning
* Report management
* Administrative routes
* Admin API integration

---

# 🤝 Shared/Core Frontend Files

The following files are maintained collaboratively:

```text
src/
├── App.jsx
├── main.jsx
├── index.css
├── App.css
│
├── theme/
│   ├── index.js
│   ├── palette.js
│   └── typography.js
│
├── styles/
│   ├── globals.css
│   └── animations.css
│
└── utils/
    └── constants.js

package.json
vite.config.js
.env
index.html
```

---

# 🔗 Team Integration Points

### Member 1 ↔ Member 2

* Search page integration
* Profile page integration
* User data sharing
* UserCard integration
* Authentication state

### Member 2 ↔ Member 3

* Notifications generated from social interactions
* User cards can initiate chats
* Follow, like, and comment events generate notifications

### Member 2 ↔ Member 4

* User-generated reports are handled by the admin
* Social activity contributes to analytics

### Member 3 ↔ Member 4

* Chat and notification statistics can be included in admin analytics

### All Members

* Shared authentication through `AuthContext`
* Shared routing through `App.jsx`
* Shared theme and styles
* Common API configuration
* Shared application constants

---

# 🚀 Installation & Setup

## Prerequisites

Install the following before running the project locally:

* **Java 17+**
* **Spring Boot**
* **Maven**
* **.NET 8 SDK**
* **Node.js 18+**
* **npm**
* **MySQL 8.0**
* **Cloudinary Account**

---

# ☕ Java Backend Setup

```bash
# Clone the repository
git clone https://github.com/AmigosHub/amigos-social-media-application.git

# Navigate to Java backend
cd amigos_java_backend

# Install dependencies and build
mvn clean package

# Run the application
mvn spring-boot:run
```

The Java backend runs locally on:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

---

# 🔷 .NET Admin Backend Setup

```bash
# Navigate to the .NET backend
cd amigos_dotnet_backend

# Restore dependencies
dotnet restore

# Run the application
dotnet run
```

The .NET backend runs locally on:

```text
http://localhost:5000
```

Swagger:

```text
http://localhost:5000/swagger/index.html
```

---

# ⚛️ React Frontend Setup

```bash
# Navigate to frontend
cd social-media-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The React application runs locally on:

```text
http://localhost:5173
```

For production:

```bash
npm run build
```

---

# 🔐 Environment Variables

> ⚠️ **Never commit real passwords, JWT secrets, Cloudinary credentials, or database credentials to GitHub.**

## Java Backend

```properties
# Database
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# JWT
jwt.secret.key=${JWT_SECRET}
jwt.exp.time=86400000

# Cloudinary
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api-key=${CLOUDINARY_API_KEY}
cloudinary.api-secret=${CLOUDINARY_API_SECRET}
```

## ASP.NET Core

```text
DB_CONNECTION
JWT_SECRET
```

## React

```env
VITE_API_URL=http://localhost:8080
VITE_ADMIN_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:8080/ws

VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4
```

For production, these values should point to the deployed Render services.

---

# 🌐 Deployment

## ⚛️ React – Vercel

The React frontend is deployed on **Vercel**.

**Production URL:**

👉 https://social-app-test-coral.vercel.app/

---

## ☕ Java Spring Boot – Render

The Java Spring Boot backend is deployed on **Render**.

**Production API:**

👉 https://social-media-java-backend.onrender.com

**Swagger:**

👉 https://social-media-java-backend.onrender.com/swagger-ui/index.html

---

## 🔷 ASP.NET Core – Render

The ASP.NET Core admin backend is deployed on **Render**.

**Production API:**

👉 https://social-media-admin-backend.onrender.com

**Swagger:**

👉 https://social-media-admin-backend.onrender.com/swagger/index.html

---

## 🗄️ MySQL – Aiven

The application's MySQL database is hosted on **Aiven**.

```text
Database
   │
   ├── MySQL 8.0
   ├── 12 Tables
   └── Shared by Java & .NET backends
```

Both backend services connect to the same MySQL database.

---

# 📁 Project Structure

```text
amigos-social-media-application/
│
├── social_media_backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/socialmedia/
│   │       │       ├── config/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       ├── repository/
│   │       │       ├── entity/
│   │       │       ├── dto/
│   │       │       ├── security/
│   │       │       ├── exception/
│   │       │       └── websocket/
│   │       │
│   │       └── resources/
│   │           ├── application.properties
│   │           └── application-prod.properties
│   │
│   ├── Dockerfile
│   ├── pom.xml
│   └── README.md
│
├── SocialMediaAdminBackend/
│   ├── Controllers/
│   ├── Services/
│   ├── Models/
│   ├── Repositories/
│   ├── Security/
│   ├── Data/
│   ├── Program.cs
│   ├── appsettings.json
│   └── SocialMediaAdminBackend.csproj
│
└── social-media-app/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   ├── api/
    │   ├── socket/
    │   ├── routes/
    │   ├── theme/
    │   ├── styles/
    │   └── utils/
    │
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

# 📊 Project Statistics

```text
┌──────────────────────────────────────────────────────┐
│                 PROJECT STATISTICS                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Java REST APIs          : 78                       │
│  .NET Admin APIs         : 24                       │
│  Total REST APIs         : 102                      │
│                                                      │
│  Database Tables         : 12                       │
│  Backend Services        : 2                        │
│  Frontend                : React + Vite             │
│  Real-Time Communication : WebSocket + STOMP        │
│  Authentication          : JWT                      │
│  Media Storage           : Cloudinary               │
│                                                      │
│  Frontend Hosting        : Vercel                   │
│  Backend Hosting         : Render                   │
│  Database Hosting        : Aiven                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# 👥 Contributors

This project was developed collaboratively by a **4-member development team**.

| Member       | Responsibility        |
| ------------ | --------------------- |
| **Member 1** | User & Authentication |
| **Member 2** | Social Features       |
| **Member 3** | Chat & Notifications  |
| **Member 4** | Admin & Analytics     |

The team followed a modular development approach where each member was responsible for specific frontend modules and corresponding backend functionality.

---

# 🔒 Security

The application implements several security mechanisms:

* JWT-based authentication
* Role-based access control
* Password encryption using BCrypt
* Protected API endpoints
* Protected frontend routes
* Environment-based secrets
* CORS configuration
* Secure database credentials
* Separate admin API

---

# ⭐ Show Your Support

If you found this project useful or interesting, please consider giving the repository a ⭐ on GitHub.

👉 [Amigos Social Media Application](https://github.com/AmigosHub/amigos-social-media-application)

---

# 📜 License

This project is developed for **educational and demonstration purposes** as part of a full-stack application development project.

---

## 🚀 Built With

**React + Vite • Spring Boot • ASP.NET Core 8 • MySQL • WebSocket • JWT • Cloudinary • Vercel • Render • Aiven**

Made with ❤️ by the **Amigos Team**
