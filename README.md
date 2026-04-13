# NexT Smart Campus Platform

A full-stack smart campus platform with React frontend and Node.js/Express backend.

## Project Structure

```
NexT/
├── frontend/   # React + Vite (deploy to Vercel)
└── backend/    # Node.js + Express (deploy to Render)
```

## Local Development

### Backend
```bash
cd backend
npm install
npm start   # runs on :5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # runs on :5173
```

## Deployment

### Database: MongoDB Atlas (Free)
1. Create account at mongodb.com/cloud/atlas
2. Create free M0 cluster
3. Create DB user, allow all IPs (0.0.0.0/0)
4. Copy connection URI

### Backend: Render (Free)
1. Sign up at render.com with GitHub
2. New → Web Service → connect this repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add env var: `MONGO_URI` = your Atlas URI

### Frontend: Vercel (Free)
1. Sign up at vercel.com with GitHub
2. Import this repo
3. Root directory: `frontend`
4. Build command: `npm run build`
5. Output dir: `dist`
6. Add env var: `VITE_API_URL` = your Render backend URL

## Tech Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Framer Motion
- **Backend**: Node.js, Express 5, MongoDB/Mongoose, Socket.IO
- **Auth**: Custom JWT-based auth
