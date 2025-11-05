# ☁️ Cloudinary Setup Instructions

## 📋 Overview
This project uses **Cloudinary** for image and media file uploads. Cloudinary provides cloud-based storage and CDN for efficient file management.

---

## ✅ Step 1: Create Cloudinary Account

1. **Visit Cloudinary Website**
   - Go to: https://cloudinary.com/
   - Click **"Sign Up"** button

2. **Create Free Account**
   - Use your email address
   - Choose a password
   - Verify your email

3. **Complete Setup**
   - Fill in account details
   - Cloudinary provides a **free tier** with:
     - 25 GB storage
     - 25 GB bandwidth per month
     - Perfect for development and small projects

---

## ✅ Step 2: Get API Credentials

1. **Login to Dashboard**
   - Visit: https://console.cloudinary.com/
   - Login with your credentials

2. **Get Credentials**
   - On the dashboard homepage, you'll see your **Account Details**
   - You need these three values:
     ```
     Cloud Name: your_cloud_name
     API Key: your_api_key
     API Secret: your_api_secret
     ```
   - Click **"Reveal"** to show your API Secret

3. **Copy All Three Values**
   - Keep them safe - you'll need them in the next step

---

## ✅ Step 3: Update Backend .env File

1. **Open `.env` file** in backend folder
   - File location: `backend/.env`

2. **Add Cloudinary Credentials**
   Add these lines to your `.env` file:

   ```env
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

3. **Example (DO NOT USE THESE - Use your own):**
   ```env
   CLOUDINARY_CLOUD_NAME=my-tourist-website
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
   ```

4. **Save the file** (Ctrl + S)

---

## ✅ Step 4: Install Dependencies

Make sure these packages are installed in your backend:

```bash
cd backend
npm install cloudinary multer multer-storage-cloudinary
```

If they're not installed, run the command above.

---

## ✅ Step 5: Restart Backend Server

1. **Stop current backend** (if running)
   - Press `Ctrl + C` in backend terminal

2. **Start backend again:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Check console** - You should see:
   ```
   🚀 Server is running on http://localhost:5000
   🗄️  MongoDB Connected: ...
   ```

---

## ✅ Step 6: Test Upload

1. **Go to Admin Panel**
   - Navigate to: `http://localhost:5173/admin`
   - Login with admin credentials

2. **Go to Media Gallery**
   - Click on **"Media Gallery"** in sidebar

3. **Upload a Test Image**
   - Click **"Upload"** button
   - Select an image file
   - Click **"Upload Files"**

4. **Verify Upload**
   - Image should appear in the gallery
   - URL should be from `cloudinary.com` (not base64)

---

## 🔧 How It Works

### Upload Flow:
1. **Frontend** → User selects file(s)
2. **Frontend** → Sends file to `/api/media/upload` endpoint
3. **Backend** → Multer receives file
4. **Backend** → Uploads to Cloudinary via `multer-storage-cloudinary`
5. **Cloudinary** → Returns secure URL
6. **Backend** → Saves URL to database
7. **Frontend** → Displays image from Cloudinary CDN

### File Storage:
- Files are stored in Cloudinary folder: `lisaa-tourist-website`
- Images are automatically optimized
- URLs are secure HTTPS links

---

## 📝 API Endpoints

### Upload Single File
```
POST /api/media/upload
Content-Type: multipart/form-data
Body: file (FormData)
```

### Upload Multiple Files
```
POST /api/media/upload-multiple
Content-Type: multipart/form-data
Body: files[] (FormData array, max 10 files)
```

### Create Media (with URL or base64)
```
POST /api/media
Content-Type: application/json
Body: { url, title, type, category, ... }
```

---

## 🚨 Troubleshooting

### Error: "Invalid API credentials"
- **Solution:** Check your `.env` file has correct Cloudinary credentials
- Make sure there are no extra spaces in the values

### Error: "File too large"
- **Solution:** Default max file size is 50MB
- Can be changed in `backend/middleware/upload.js`

### Error: "Upload failed"
- **Solution:** Check Cloudinary dashboard for upload limits
- Free tier has 25GB storage limit

### Images not showing
- **Solution:** Check if URL is from `cloudinary.com`
- Verify CORS settings in Cloudinary dashboard

---

## 📚 Additional Resources

- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Multer Docs:** https://github.com/expressjs/multer
- **Cloudinary Dashboard:** https://console.cloudinary.com/

---

## ✅ Setup Complete!

Once you've completed these steps, your image upload system will use Cloudinary instead of base64. This provides:
- ✅ Faster uploads
- ✅ Better performance
- ✅ Automatic image optimization
- ✅ CDN delivery
- ✅ Reduced database size

