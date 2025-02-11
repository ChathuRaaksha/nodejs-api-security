# Secure Express.js API

A secure REST API built with Express.js featuring JWT authentication, rate limiting, and security middleware. This API provides user management functionality with secure endpoints and database integration.

## 🔐 Security Features

- JWT (JSON Web Token) authentication
- Rate limiting to prevent brute-force attacks
- Security headers with Helmet.js
- CORS protection
- Environment variable configuration
- SQL injection prevention with prepared statements

## 🛠️ Technologies Used

- Node.js & Express.js
- MySQL (with mysql2 driver)
- JSON Web Tokens (JWT)
- Express Rate Limit
- Helmet.js
- CORS
- dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key
TOKEN_EXPIRY=24h
```

## 🚀 Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Install dependencies:
```bash
npm install
```

3. Set up your MySQL database and create the necessary tables:
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department_id INT,
    role_id INT
);

CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);
```

4. Start the server:
```bash
npm start
```

## 📍 API Endpoints

### Authentication Routes

#### POST /register
Register a new user
- Required fields: `name`, `email`, `department_id`, `role_id`
- Returns: User ID and success message

#### POST /login
Login user and get JWT token
- Required fields: `email`
- Returns: JWT token

### Protected Routes

#### GET /users
Get all users (requires authentication)
- Header: `Authorization: Bearer <token>`
- Returns: List of users with their department information

#### DELETE /users/:id
Delete a user (requires authentication)
- Header: `Authorization: Bearer <token>`
- URL Parameter: `id` (user ID to delete)
- Returns: Success message

## 🔒 Security Configurations

### Rate Limiting
- 100 requests per 15 minutes window per IP
- Helps prevent brute-force attacks

### JWT Authentication
- Tokens expire as per TOKEN_EXPIRY environment variable
- Bearer token format required for protected routes

### Security Headers (Helmet.js)
- XSS Protection
- Prevention of clickjacking
- Strict Transport Security
- Content Security Policy headers

## 📝 Error Handling

The API includes error handling for:
- Invalid/missing JWT tokens
- Rate limit exceeded
- Database connection failures
- Invalid input data
- Resource not found

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
