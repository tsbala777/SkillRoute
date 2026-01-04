# SkillRoute Deployment Guide

## Deployment Architecture

- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (FastAPI + Python)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth

---

## 🚀 Quick Deploy

### Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Render account (free)
- [ ] Firebase project set up
- [ ] OpenAI API key

---

## Backend Deployment (Render)

### Step 1: Push to GitHub

```bash
cd "d:\DEV\WEB PROJECTS\SkillRoute"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skillroute.git
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `skillroute-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 3: Add Environment Variables

In Render dashboard, add these environment variables:

```
PROJECT_NAME=SkillRoute
ENV=production
OPENAI_API_KEY=sk-proj-...
```

**For Firebase (from your firebase_key.json):**
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com
```

**Important**: 
- Replace `\n` in the private key with actual newlines in Render's environment variables
- Or upload the entire `firebase_key.json` as a secret file

### Step 4: Deploy

Click **"Create Web Service"** and wait for deployment (~5 minutes)

Your backend URL will be: `https://skillroute-backend.onrender.com`

---

## Frontend Deployment (Vercel)

### Step 1: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Add Environment Variables

In Vercel project settings → Environment Variables:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_API_URL=https://skillroute-backend.onrender.com
```

### Step 3: Deploy

Click **"Deploy"** and wait (~2 minutes)

Your frontend URL will be: `https://skillroute-yourname.vercel.app`

---

## Post-Deployment Configuration

### 1. Update CORS Settings

After getting your Vercel URL, update `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://skillroute-yourname.vercel.app"  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push to trigger redeployment.

### 2. Update Firebase Auth Domains

In Firebase Console:
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your Vercel domain: `skillroute-yourname.vercel.app`

### 3. Test Your Deployment

- Frontend: Visit your Vercel URL
- Backend: Visit `https://skillroute-backend.onrender.com/` (should see status)
- API Docs: Visit `https://skillroute-backend.onrender.com/docs`

---

## Troubleshooting

### Backend Issues

**Cold Starts**: Render free tier sleeps after 15 minutes of inactivity
- First request may take 30-60 seconds
- Consider upgrading to paid tier for production

**Firebase Connection**:
```bash
# Test Firebase connection
curl https://skillroute-backend.onrender.com/students
```

**Check Logs**: 
- Render Dashboard → Your Service → Logs

### Frontend Issues

**Environment Variables Not Working**:
- Ensure all variables start with `VITE_`
- Redeploy after adding variables
- Clear browser cache

**API Connection Errors**:
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Open browser console for errors

---

## Custom Domain (Optional)

### Vercel (Frontend)
1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `skillroute.com`)
3. Update DNS records as instructed

### Render (Backend)
1. Render Dashboard → Settings → Custom Domain
2. Add subdomain (e.g., `api.skillroute.com`)
3. Update DNS records

---

## Monitoring & Maintenance

### Performance Monitoring
- **Vercel**: Built-in analytics in dashboard
- **Render**: Check metrics and logs in dashboard

### Database Usage
- Monitor Firebase usage in Firebase Console
- Free tier: 50K reads, 20K writes per day

### Cost Optimization
- **Current Setup**: $0/month (free tiers)
- **Production Ready**: 
  - Render: $7/month (no cold starts)
  - Vercel: Free (Pro: $20/month)
  - Firebase: Pay-as-you-go

---

## Continuous Deployment

Both Vercel and Render automatically deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
# ✨ Auto-deploys to both platforms
```

---

## Environment Variables Checklist

### Backend (Render)
- [x] PROJECT_NAME
- [x] ENV
- [x] OPENAI_API_KEY
- [x] FIREBASE_PROJECT_ID
- [x] FIREBASE_PRIVATE_KEY
- [x] FIREBASE_CLIENT_EMAIL

### Frontend (Vercel)
- [x] VITE_FIREBASE_API_KEY
- [x] VITE_FIREBASE_AUTH_DOMAIN
- [x] VITE_FIREBASE_PROJECT_ID
- [x] VITE_FIREBASE_STORAGE_BUCKET
- [x] VITE_FIREBASE_MESSAGING_SENDER_ID
- [x] VITE_FIREBASE_APP_ID
- [x] VITE_API_URL

---

## Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Firebase Docs**: https://firebase.google.com/docs

---

## Security Notes

⚠️ **Important Security Practices**:

1. **Never commit** `.env` files to GitHub
2. **Use** environment variables for all secrets
3. **Rotate** API keys regularly
4. **Enable** Firebase Security Rules
5. **Monitor** usage to detect anomalies

---

Good luck with your deployment! 🚀
