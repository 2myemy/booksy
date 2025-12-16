# Booksy 📚

**Booksy** is a full-stack web application where users can buy and sell books.
This project is built to demonstrate practical frontend and backend engineering skills,
focusing on clean UI, RESTful APIs, and real-world application architecture.

---

## 🚀 Features

- User authentication with JWT (sign up / login)
- Browse books with title, price, and description
- Add and manage book listings
- Review and rating system for books
- Responsive UI with modern design
- REST API integration between frontend and backend

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- TailwindCSS

### Backend
- Node.js
- Express

### Database
- PostgreSQL (Heroku Postgres)

### Authentication
- JWT (JSON Web Tokens)

### Deployment
- Frontend: Netlify  
- Backend & Database: Heroku

---

## 📂 Project Structure
booksy/
├── client/        # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── styles/
│   └── index.html
│
├── server/        # Node.js + Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── db/
│   └── index.ts
│
└── README.md


---

## 🧑‍💻 Getting Started

### 1. Clone the repository
```
git clone https://github.com/2myemy/booksy.git
cd booksy
```

### 2. Frontend setup
```
cd client
npm install
npm run dev
```

### 3. Backend setup
```
cd server
npm install
npm run dev
```

## 🌱 Environment Variables

Create a .env file in the server directory:
```
PORT=4000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
```

## 🎯 Project Goals

Build a real-world full-stack application from scratch

Practice frontend architecture with React and TypeScript

Design and implement RESTful APIs

Work with relational databases and authentication

Deploy and connect frontend and backend services

## 📌 Future Improvements

Image upload for book listings

Search and filter functionality

User profile pages

Pagination and performance optimization

📬 Contact
Created by Chloe Lee
LinkedIn: https://linkedin.com/in/the-chloest
