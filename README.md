# InternVerse – Internship Management System

A full-stack web application for managing internships with Admin, HR/Manager, and Intern dashboards.

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Recharts, Lucide React
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Auth:** JWT + bcrypt
- **Email:** Nodemailer
- **PDF:** pdfkit

## Quick Start

### Backend
```bash
cd server
npm install
# Edit .env with your MongoDB URI
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Seed Admin/HR Users
```bash
cd server
node seed.js
```

**Default credentials:**
- Admin: `admin@internverse.com` / `admin123`
- HR: `hr@internverse.com` / `hr123456`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `PORT` | Server port (default: 5000) |
| `CLIENT_URL` | Frontend URL (default: http://localhost:5173) |
| `EMAIL_USER` | SMTP email address |
| `EMAIL_PASS` | SMTP app password |

## Features

- **3 Role-Based Dashboards** (Admin, HR, Intern)
- **Intern Management** – Add, edit, activate/deactivate, track progress
- **Task Management** – Create, assign, submit, approve/reject with deadlines
- **Performance Evaluations** – Score on 6 metrics with radar charts
- **Certificate Generation** – Professional PDF certificates with auto-generation
- **Email Notifications** – Automated emails for key events
- **Analytics Charts** – Area, pie, bar, and radar charts via Recharts
- **Responsive Design** – Mobile-friendly with collapsible sidebar
