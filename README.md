# Role-Based Authentication System

A Next.js application with role-based authentication and routing using the App Router.

## Features

- **Login Page**: Beautiful login form with role selection
- **Role-Based Routing**: 
  - Admin users → `/dashboard`
  - Regular users → `/profile`
- **Admin Dashboard**: Comprehensive admin interface with:
  - Overview with statistics
  - User management (placeholder)
  - Analytics (placeholder)
  - Settings (placeholder)
- **User Profile**: Complete user profile management with:
  - Editable profile information
  - Activity timeline
  - Account settings
- **Modern UI**: Built with Tailwind CSS for a responsive and beautiful design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextjs-project
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Login Flow

1. Navigate to the home page (`/`)
2. Fill in the login form with any email and password
3. Select your role:
   - **Admin**: Will redirect to `/dashboard`
   - **User**: Will redirect to `/profile`

### Admin Dashboard (`/dashboard`)

The admin dashboard includes:
- **Overview Tab**: Statistics and recent activities
- **Users Tab**: User management (placeholder)
- **Analytics Tab**: Analytics dashboard (placeholder)
- **Settings Tab**: System settings (placeholder)

### User Profile (`/profile`)

The user profile page includes:
- **Profile Tab**: Editable user information
- **Activity Tab**: Recent user activities
- **Settings Tab**: Account settings and password change

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   └── page.js          # Admin dashboard
│   ├── profile/
│   │   └── page.js          # User profile
│   ├── globals.css          # Global styles
│   ├── layout.js            # Root layout
│   └── page.js              # Login page (home)
├── middleware.js            # Route protection middleware
└── ...
```

## Frontend-Only Implementation

This is currently a frontend-only implementation. The authentication and role-based routing are simulated:

- No actual backend authentication
- Role selection is done via dropdown in the login form
- No persistent session management
- All data is mock data

## Future Enhancements

To make this a complete application, you would need to add:

1. **Backend API**:
   - User authentication endpoints
   - Role verification
   - Session management

2. **Database**:
   - User table with roles
   - Profile information
   - Activity logs

3. **Security**:
   - JWT tokens or session-based auth
   - Password hashing
   - CSRF protection

4. **State Management**:
   - User context/state
   - Persistent login state
   - Role-based access control

## Technologies Used

- **Next.js 14** with App Router
- **React 18** with hooks
- **Tailwind CSS** for styling
- **JavaScript** (ES6+)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
