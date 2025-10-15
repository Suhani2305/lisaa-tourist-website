# Lisaa Project

A full-stack application with Vite.js frontend and Node.js/Express backend.

## Project Structure

```
Lisaa/
├── frontend/          # Vite.js + React + TypeScript
├── backend/           # Node.js + Express
└── README.md
```

## Frontend Setup

The frontend is built with:
- ⚡ Vite.js for fast development
- ⚛️ React 18 with TypeScript
- 🎨 Modern CSS and styling

### Getting Started

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Backend Setup

The backend is built with:
- 🚀 Node.js + Express
- 🔄 CORS enabled for frontend communication
- 📝 JSON API endpoints

### Getting Started

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Server will run on [http://localhost:5000](http://localhost:5000)

### API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

## Development

### Running Both Servers

1. **Terminal 1** - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Terminal 2** - Backend:
   ```bash
   cd backend
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the backend directory:
```
PORT=5000
NODE_ENV=development
```

## Features

- ✅ Separate frontend and backend folders
- ✅ Hot reload for both frontend and backend
- ✅ CORS configured for cross-origin requests
- ✅ TypeScript support in frontend
- ✅ Modern development setup
- ✅ API endpoints ready for use

## Next Steps

1. Add database integration (MongoDB/PostgreSQL)
2. Implement authentication
3. Add more API endpoints
4. Enhance frontend UI/UX
5. Add testing setup

Happy coding! 🚀
