# Deployment Guide (Render + Vercel)

## 1) Push code to GitHub
1. Create a GitHub repo.
2. Push this project (`backend` + `frontend`) to the repo.

## 2) Deploy MongoDB (MongoDB Atlas)
1. Create a free cluster in MongoDB Atlas.
2. Create DB user/password.
3. In **Network Access**, allow your app (for quick setup: `0.0.0.0/0`).
4. Copy connection string, example:
   `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/helpdesk?retryWrites=true&w=majority`

## 3) Deploy Backend on Render
1. Go to Render -> **New** -> **Web Service**.
2. Connect your GitHub repo.
3. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add Environment Variables:
   - `PORT=5000`
   - `MONGO_URI=<your_atlas_connection_string>`
   - `JWT_SECRET=<long_random_secret>`
   - `JWT_EXPIRES=7d`
   - `CLIENT_URL=https://<your-frontend-domain>`
   - `DEFAULT_ADMIN_NAME=Admin User`
   - `DEFAULT_ADMIN_EMAIL=admin@helpdesk.com`
   - `DEFAULT_ADMIN_PASSWORD=Admin@123`
   - `GEMINI_API_KEY=<your_gemini_api_key>`
   - `GEMINI_MODEL=gemini-1.5-flash`
5. Deploy and copy backend URL:
   `https://<your-backend>.onrender.com`

## 4) Deploy Frontend on Vercel
1. Go to Vercel -> **New Project** and import the same GitHub repo.
2. Configure:
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
3. Add Environment Variable:
   - `VITE_API_URL=https://<your-backend>.onrender.com/api`
4. Deploy.

## 5) Final CORS update
After Vercel gives your final URL, update backend `CLIENT_URL` in Render to:
`https://<your-vercel-domain>`

If you use local + production together, set comma-separated origins:
`http://localhost:5173,https://<your-vercel-domain>`

## 6) Smoke tests
1. Open: `https://<your-backend>.onrender.com/api/health`
2. Open frontend URL and login with default admin:
   - email: `admin@helpdesk.com`
   - password: `Admin@123`
3. Create a ticket and verify dashboard stats update.

## Notes
- Render free tier may sleep; first API request can take ~30-60 seconds.
- `uploads/` is local disk; on free hosting this is ephemeral. For production, move file uploads to Cloudinary/S3.
