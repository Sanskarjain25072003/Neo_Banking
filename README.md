# Mini NeoBank Dashboard

A simplified digital banking application built with React and Node.js, featuring user authentication, money transfers, and transaction history.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Account Management**: View balance and account details
- **Add Money**: Top up your account balance
- **Send Money**: Transfer money between users
- **Transaction History**: View all deposits and transfers
- **Modern UI**: Clean, responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests

### Frontend
- React 19 with Vite
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd neobanking
```

### 2. Backend Setup

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the server directory:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=mongodb://localhost:27017/neobank
PORT=3000
```

Start the backend server:
```bash
npm run dev
```

The backend will be running on `http://localhost:3000`

### 3. Frontend Setup

Navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

### 4. Database Setup

Make sure MongoDB is running on your system. The application will automatically create the database and collections when you first sign up.

## 📱 Usage

1. **Sign Up**: Create a new account with your name, email, and password
2. **Login**: Sign in with your credentials
3. **Add Money**: Top up your account balance
4. **Send Money**: Transfer money to other users by email
5. **View History**: Check your transaction history

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Banking
- `GET /api/banking/profile` - Get user profile and balance
- `POST /api/banking/add-money` - Add money to account
- `POST /api/banking/send-money` - Send money to another user
- `GET /api/banking/transactions` - Get transaction history

## 🏗️ Project Structure

```
neobanking/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── banking.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddMoney.jsx
│   │   │   ├── SendMoney.jsx
│   │   │   ├── TransactionHistory.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Input validation
- CORS configuration

## 🎨 UI Features

- Responsive design
- Modern banking app aesthetics
- Loading states
- Error handling
- Success/error messages
- Clean transaction history display

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB Atlas cluster or use a cloud MongoDB service
2. Update the `MONGODB_URI` in your `.env` file
3. Deploy to platforms like Heroku, Railway, or Vercel

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `dist` folder to platforms like Vercel, Netlify, or GitHub Pages
3. Update the API base URL in `src/utils/api.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Ensure MongoDB is running and the connection string is correct
2. **CORS Error**: Make sure the backend is running on the correct port
3. **JWT Error**: Check if the JWT_SECRET is set in the environment variables

### Getting Help

If you encounter any issues, please check the console logs for error messages and ensure all dependencies are properly installed.

---

**Happy Banking! 🏦**
