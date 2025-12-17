# Booksy 📚

**Booksy** is a full-stack book marketplace where users can buy and sell books.
Built to explore real-world CRUD flows, authentication, and intuitive user experiences.

🔗 Live Demo: https://booksy-client.netlify.app

🔗 Backend API: https://booksy-api-4d70c4614990.herokuapp.com


---

## 🚀 Features

- User authentication with JWT (sign up / login)
- Browse books with title, price, and description
- Create, edit, and delete book listings
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
```text
booksy/
├── client/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── styles/
│   └── index.html
│
├── server/              # Node.js + Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── db/
│   └── index.ts
│
└── README.md
```


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


## 🔍 Key Challenges & Learnings
- Designing clean authentication flows with JWT
- Managing async API states (loading, errors)
- Structuring backend routes for scalability
- Coordinating frontend & backend deployments


## 📌 Future Improvements
- Image upload for book listings
- Search and filter functionality
- User profile pages
- Review and rating system for books
- Pagination and performance optimization


## 📬 Contact
Created by **Chloe Lee**
- LinkedIn: https://linkedin.com/in/the-chloest
- Portfolio: https://chloe-lee.netlify.app
