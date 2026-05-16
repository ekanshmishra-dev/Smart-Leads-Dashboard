# Smart Leads Dashboard 🚀

A professional, production-ready Full Stack Lead Management System built with React, Node.js, and MongoDB. This project features a modern SaaS UI, secure JWT authentication, advanced filtering, and real-time analytics.

## ✨ Key Features

- **🔐 Secure Authentication**: JWT-based login/register with role-based access (Admin/User).
- **📊 Interactive Dashboard**: Real-time stats cards and analytics charts using Recharts.
- **💼 Lead Management (CRUD)**: Create, view, update, and delete leads with ease.
- **🔍 Advanced Search & Filter**: Debounced search by name/email, filter by status/source, and multi-sort.
- **📄 Backend Pagination**: Optimized performance with server-side pagination.
- **🌓 Dark Mode**: Built-in dark mode support with a sleek modern aesthetic.
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices.
- **🐳 Docker Ready**: Containerized with Docker and Docker Compose for easy deployment.

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- TypeScript
- TailwindCSS (Styling)
- React Router DOM (Routing)
- Axios (API Calls)
- Context API (State Management)
- React Hook Form + Zod (Form Validation)
- Framer Motion (Animations)
- Lucide React (Icons)

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose (Database)
- JWT + Bcryptjs (Security)
- Express Validator (API Validation)

## 📁 Project Structure

```text
smart-leads-dashboard/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI Components
│   │   ├── pages/       # Page Views
│   │   ├── context/     # Auth & App State
│   │   ├── layouts/     # Dashboard Layouts
│   │   └── utils/       # API & Helpers
├── server/              # Express Backend
│   ├── src/
│   │   ├── controllers/ # Business Logic
│   │   ├── models/      # Mongoose Schemas
│   │   ├── routes/      # API Endpoints
│   │   └── middleware/  # Auth & Error Handlers
└── docker-compose.yml   # Orchestration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Docker (Optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/smart-leads-dashboard.git
   cd smart-leads-dashboard
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Create .env file and add MONGODB_URI & JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Running with Docker
```bash
docker-compose up --build
```

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/profile` - Get current user profile (Protected)

### Leads
- `GET /api/leads` - Get all leads (Search, Filter, Paginate)
- `POST /api/leads` - Create a new lead
- `GET /api/leads/stats` - Get dashboard analytics
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead (Admin only)

## 📝 License
This project is licensed under the MIT License.
