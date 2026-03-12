# Simper HRMS — HR Management Frontend

A modern, production-ready React dashboard for the HR Management Django REST API.

## Tech Stack

- **React 18** + **Vite**
- **TailwindCSS** — dark theme, custom design system
- **React Router v6** — lazy-loaded protected routes
- **TanStack React Query v5** — data fetching & caching
- **Zustand** — auth state persistence
- **Axios** — API client with JWT interceptors + refresh logic
- **React Hook Form** — form handling
- **Recharts** — dashboard charts
- **Lucide React** — icons
- **React Hot Toast** — notifications

## Prerequisites

- Node.js 18+
- Django backend running on `http://localhost:8000`

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure the API URL
# Edit .env if your backend runs on a different port:
# VITE_API_BASE_URL=http://localhost:8000/api

# 3. Start development server
npm run dev
# → Opens at http://localhost:3000

# 4. Build for production
npm run build
```

## Backend Setup

Start the Django backend first:

```bash
cd hr_managemnt-master
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## API Endpoints Integrated

| Module          | Endpoint                  |
|----------------|---------------------------|
| Auth (JWT)      | POST /api/auth/jwt/       |
| Token Refresh   | POST /api/auth/jwt/refresh/ |
| Users           | /api/users/               |
| Departments     | /api/v1/departments/      |
| Job Roles       | /api/v1/roles/            |
| Employees       | /api/v1/employees/        |
| Attendance      | /api/v1/attendance/       |
| Leave Requests  | /api/v1/leaves/           |
| Payslips        | /api/v1/payslips/         |
| Job Openings    | /api/v1/job-openings/     |
| Candidates      | /api/v1/candidates/       |
| Applications    | /api/v1/applications/     |
| Reviews         | /api/v1/reviews/          |
| Activity Logs   | /api/v1/activity-logs/    |
| Notifications   | /api/v1/notifications/    |

## Pages

| Route            | Description                          |
|-----------------|--------------------------------------|
| `/`             | Landing page (public)                |
| `/login`        | JWT login                            |
| `/register`     | User registration                    |
| `/dashboard`    | Stats, charts, recent activity       |
| `/employees`    | CRUD employee management             |
| `/departments`  | CRUD departments + roles             |
| `/attendance`   | Attendance records                   |
| `/leave`        | Leave request management + approval  |
| `/payroll`      | Payslip management                   |
| `/recruitment`  | Jobs, candidates, application pipeline |
| `/performance`  | Performance reviews with star ratings|
| `/profile`      | User profile                         |
| `/settings`     | App settings                         |

## Authentication Flow

1. User logs in → receives `access` + `refresh` JWT tokens
2. Tokens stored in `localStorage` + Zustand persisted store
3. Axios interceptor attaches `Bearer` token to every request
4. On 401 → automatically attempts token refresh
5. If refresh fails → redirects to `/login`
6. Protected routes redirect unauthenticated users to `/login`

## Project Structure

```
src/
├── api/
│   ├── axiosClient.js     # Axios instance + interceptors
│   ├── authApi.js         # Login / refresh
│   └── index.js           # All API modules
├── components/
│   ├── layout/
│   │   ├── Layout.jsx     # App shell
│   │   ├── Sidebar.jsx    # Desktop navigation
│   │   ├── Navbar.jsx     # Top bar + notifications
│   │   └── MobileNav.jsx  # Bottom mobile nav
│   └── ui/
│       ├── Badge.jsx
│       ├── DataTable.jsx
│       ├── Modal.jsx
│       ├── Skeleton.jsx
│       ├── Spinner.jsx
│       └── StatCard.jsx
├── hooks/
│   └── useAuth.js
├── pages/
│   ├── auth/             Login, Register
│   ├── landing/          Landing page
│   ├── dashboard/        Main dashboard
│   ├── employees/        Employee management
│   ├── departments/      Department + roles
│   ├── attendance/       Attendance tracking
│   ├── leave/            Leave management
│   ├── payroll/          Payroll & payslips
│   ├── recruitment/      Hiring pipeline
│   ├── performance/      Reviews & ratings
│   ├── profile/          User profile
│   └── settings/         App settings
├── router/
│   └── routes.jsx        Protected + public routes
├── store/
│   └── authStore.js      Zustand auth store
└── index.css             TailwindCSS + custom classes
```
