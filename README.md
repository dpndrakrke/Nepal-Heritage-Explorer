# Nepal Heritage Explorer

A full-stack web application for exploring and managing heritage sites in Nepal. Built with React, Node.js, Express, and MySQL.

## 🚀 Features

### Public Access
- Browse heritage listings
- View heritage details
- Search and filter heritages
- About and Contact pages

### User Features
- User registration and authentication
- Profile management
- Save/unsave heritage sites
- View saved heritages
- Book visits to heritage sites

### Admin Features
- Dashboard with statistics
- User management (view, edit, delete)
- Heritage management (add, edit, delete)
- Upload heritage images

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS v3** - Styling with custom components
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **JWT Decode** - Token handling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin requests

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd newclassrepo
```

### 2. Set up the database
```sql
CREATE DATABASE nepal_heritage_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 3. Configure environment variables

**Backend** (`newclassrepo/backend/.env`):
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_token_key_here_change_this_in_production
DB_NAME=nepal_heritage_db
DB_USER=root
DB_PASS=your_mysql_password
DB_HOST=localhost
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend** (`newclassrepo/frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Install dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 5. Start the servers

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🎨 Tailwind CSS Components

The application uses custom Tailwind CSS v3 components:

### Buttons
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons  
- `.btn-danger` - Destructive action buttons

### Forms
- `.input-field` - Standard input styling
- `.input-error` - Error state for inputs
- `.form-label` - Form labels
- `.form-error` - Error messages

### Cards
- `.card` - Card container
- `.card-header` - Card header section
- `.card-body` - Card content section

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Heritage Sites (Public)
- `GET /api/heritages` - Get all heritages
- `GET /api/heritage/:id` - Get heritage by ID
- `GET /api/categories` - Get heritage categories

### User Features
- `POST /api/saveHeritage/:id` - Toggle save heritage
- `GET /api/savedHeritages` - Get saved heritages

### Admin Features
- `GET /api/admin/allUsers` - Get all users
- `GET /api/admin/user/:id` - Get user by ID
- `PUT /api/admin/user/:id` - Update user
- `DELETE /api/admin/deleteUser/:id` - Delete user
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/heritageManagement` - Get heritage management data

### Heritage Management (Admin)
- `POST /api/heritage` - Create heritage
- `PUT /api/heritage/:id` - Update heritage
- `DELETE /api/heritage/:id` - Delete heritage

## 🗄️ Database Schema

### Users
- id, firstName, lastName, username, email, password, phone, profileImage, role, isActive, lastLogin

### Heritage Sites
- id, name, description, shortDescription, location, category, historicalPeriod, builtYear, architect, significance, visitingHours, entryFee, latitude, longitude, isActive, featured, createdBy

### Images
- id, filename, originalName, path, size, mimeType, isPrimary, caption, heritageId, uploadedBy

### Saved Heritage
- id, userId, heritageId, notes, rating

### Bookings
- id, userId, heritageSiteId, status, visitDate, numberOfPeople, totalAmount, specialRequests, bookingNotes

### User Addresses
- id, userId, addressLine1, addressLine2, city, state, postalCode, country, phoneNumber, isDefault, addressType

## 🔐 Authentication

The application uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in API requests.

### Role-based Access
- **Public**: Browse heritage listings
- **User**: Manage profile, save heritages, book visits
- **Admin**: Full access to user and heritage management

## 🎨 UI Components

### Public Pages
- Homepage with hero section and features
- Heritage listing with search and filters
- Heritage detail page
- About and Contact pages

### User Pages
- Registration and Login forms with validation
- User dashboard with profile information
- Profile management
- Saved heritages

### Admin Pages
- Admin dashboard with statistics
- User management table
- Heritage management interface

## 🚀 Deployment

### Backend Deployment
1. Set up a production database
2. Configure environment variables
3. Set `NODE_ENV=production`
4. Use a process manager like PM2

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to a web server
3. Configure environment variables for production

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite development server
```

### Database Migrations
The application uses Sequelize with `{ alter: true }` for development. For production, use proper migrations.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please create an issue in the repository or contact the development team.

---

**Nepal Heritage Explorer** - Discover the rich heritage of Nepal! 🏛️🇳🇵 