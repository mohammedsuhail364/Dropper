# 🛍️ Dropship Web Application

A modern, full-featured Dropshipping web application built using the **MERN stack**. It supports **secure user authentication with JWT**, **Stripe payment integration**, and **state management via Redux Toolkit (slices/actions)**.

## 🚀 Features

- 🔒 Secure user registration and login using JWT
- 🛒 Add-to-cart, checkout, and order history
- 💳 Stripe integration for secure payments
- 📦 Product management and listings
- 🧾 Admin dashboard for managing users, orders, and inventory
- 🗂️ State management using Redux Toolkit slices and async thunks
- 🎨 Responsive UI built with Tailwind CSS and React
- 🌐 RESTful API using Express and MongoDB

---

## 🧰 Tech Stack

### Frontend
- **React.js**
- **Redux Toolkit** (Slices & Actions)
- **Tailwind CSS**
- **Axios**
- **Framer Motion** (optional for UI animations)

### Backend
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT for Authentication**
- **Stripe API for Payments**

---

## 🔐 Authentication

- Users can **sign up / sign in** using email and password
- JWT tokens are used to protect private routes
- Middleware verifies token validity on backend

---

## 💳 Payment Integration

- Integrated with **Stripe Checkout**
- Users can place real-time, secure orders using Stripe
- Order data is stored upon successful transaction

---

## 📂 Project Structure (Simplified)

root/
├── client/ # React frontend
│ ├── src/
│ │ ├── app/ # Redux store
│ │ ├── features/ # Redux slices and async thunks
│ │ ├── pages/ # Page components (Home, Cart, Product)
│ │ └── ...
├── server/ # Express backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── ...
├── .env
├── package.json
└── README.md


---

## 🛠️ Getting Started

### Prerequisites
- Node.js
- MongoDB
- Stripe Account (for API keys)

### Environment Variables

Create a `.env` file in the root of your project:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:3000
```

Install Dependencies

# Backend
cd server
npm install

# Frontend
cd client
npm install

Run the Application

# Start Backend
cd server
npm run dev

# Start Frontend
cd client
npm start

🧪 Testing

Manual testing for authentication, product flow, and payment

Postman collection available for backend API endpoints

🙌 Acknowledgements

Stripe

Redux Toolkit

MongoDB
