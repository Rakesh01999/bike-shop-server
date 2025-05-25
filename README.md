# Bike Shop Backend

## 📌 Project Overview
The **Bike Shop Backend** is the server-side application that powers the **Bike Shop** e-commerce platform. It is built using **Node.js, Express.js, and MongoDB**, providing RESTful APIs for managing bikes, user authentication, orders, and payments.

## Live Link
[Live-Server](https://bike-shop-server-six.vercel.app/)

## 🚀 Features
- **User Authentication** (JWT-based login, register, password reset)
- **Role-Based Access Control** (Admin, Customer)
- **Bike Management** (CRUD operations for bike listings)
- **Order Processing** (Order placement, tracking, and history)
- **Payment Integration** (Shurjopay payment gateway)
- **Image Uploads** (Cloudinary integration for storing images)
- **Secure API Endpoints** (Middleware authentication & validation)

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT, bcrypt.js
- **Cloud Storage**: Cloudinary
- **Payment Gateway**: Shurjopay
- **API Documentation**: Swagger
- **Environment Variables**: dotenv

## 📂 Project Structure
```
backend/
├── src/
│   ├── controllers/        # Handles request logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── config/             # Database & environment configs
│   ├── utils/              # Helper functions
│   ├── app.js              # Express app initialization
│   ├── server.js           # Main server file
├── .env                    # Environment variables
├── package.json            # Dependencies & scripts
└── README.md               # Documentation
```

## 📦 Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/bike-shop-backend.git
cd bike-shop-backend
```
### 2️⃣ Install Dependencies
```sh
npm install
```
### 3️⃣ Configure Environment Variables
Create a `.env` file and add the following:
```
PORT=5000
DATABASE_URL=<your-mongodb-connection-string>
JWT_ACCESS_SECRET=<your-jwt-access-secret>
JWT_REFRESH_SECRET=<your-jwt-refresh-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
SP_ENDPOINT=https://sandbox.shurjopayment.com
SP_USERNAME=sp_sandbox
SP_PASSWORD=code
SP_RETURN_URL=https://yourfrontend.com/order/verify
```

### 4️⃣ Start the Server
```sh
npm run dev  # For development (nodemon)
npm start    # For production
```

## 🔥 API Endpoints
### 🛡️ **Auth Routes**
| Method | Endpoint         | Description |
|--------|----------------|-------------|
| POST   | /api/v1/auth/register | Register a new user |
| POST   | /api/v1/auth/login    | User login |
| GET    | /api/v1/auth/profile  | Get user profile (protected) |

### 🚴 **Bike Management**
| Method | Endpoint         | Description |
|--------|----------------|-------------|
| GET    | /api/v1/bikes        | Get all bikes |
| POST   | /api/v1/bikes        | Add a new bike (Admin only) |
| GET    | /api/v1/bikes/:id    | Get a single bike |
| PUT    | /api/v1/bikes/:id    | Update a bike (Admin only) |
| DELETE | /api/v1/bikes/:id    | Delete a bike (Admin only) |

### 🛒 **Orders**
| Method | Endpoint         | Description |
|--------|----------------|-------------|
| POST   | /api/v1/orders   | Place an order |
| GET    | /api/v1/orders   | Get user orders |
| GET    | /api/v1/orders/:id | Get order details |

### 💳 **Payments**
| Method | Endpoint          | Description |
|--------|-----------------|-------------|
| POST   | /api/v1/payments | Process payment |

## 🐳 Deployment
### 🚀 Deploy on Vercel
1. Install Vercel CLI:
   ```sh
   npm install -g vercel
   ```
2. Deploy:
   ```sh
   vercel
   ```

### 🚀 Deploy on Render
1. Create a new **Web Service** on Render.
2. Set environment variables in Render **Settings**.
3. Deploy directly from GitHub.

## 🎯 Contribution
1. Fork the repository
2. Create a new branch (`feature/new-feature`)
3. Commit your changes
4. Push to your forked repo
5. Create a Pull Request (PR)


