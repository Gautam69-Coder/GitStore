# GitStore (InstaRep AI)

A modern, responsive, full-stack web-based GitHub repository manager. Manage repositories, inspect directory trees, view commit activity, and interact with the GitHub REST API seamlessly from a sleek, intuitive dashboard.

---

## 🌟 Key Features

- **Multi-Mode Authentication**:
  - **Personal Access Token (PAT)**: Connect directly using your GitHub Personal Access Token.
  - **GitHub OAuth**: Full web application authorization flow via GitHub OAuth credentials.
  - **Interactive Demo Mode**: Explore all UI features and dashboard analytics immediately without requiring GitHub credentials.
- **Token Security**:
  - When you enter your Personal GitHub Token, the **Token is stored in localStorage** in your browser.
  - Tokens are transmitted exclusively over secure channels directly to GitHub API endpoints and are **never saved or stored in any remote database**.
- **Repository Operations**:
  - Browse and filter all public and private repositories.
  - Create new repositories with custom templates, README, and license options.
  - Delete repositories safely with confirmation safeguards.
  - Star, unstar, and fork repositories.
- **Repository Explorer**:
  - Deep file hierarchy exploration with file viewer.
  - Real-time commit history and activity feeds.
  - Branch and release switchers.
- **Modern UI & Aesthetic**:
  - Crafted with Tailwind CSS, Lucide icons, responsive Bento-style cards, and subtle micro-interactions.

---

## 🔐 Token Storage & Security

> **Important Notice on Personal GitHub Tokens:**
> When a user enters their personal GitHub token, the **Token is stored in localStorage** on the client side (`gitstore_token`). It is used exclusively to sign requests via HTTP `Authorization: Bearer <token>` headers to the GitHub REST API. GitStore never logs, saves, or transfers tokens to third-party databases.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **React 18** (Vite)
- **Tailwind CSS** (Styling & responsive layout)
- **React Router DOM v7** (Client-side routing)
- **Lucide React** (Icons)
- **Canvas Confetti** (Celebration animations)

### Backend (`/server`)
- **Node.js & Express**
- **@octokit/rest** (GitHub API SDK)
- **Axios** (OAuth token exchange)
- **dotenv** (Environment configuration)
- **CORS & Cookie-Parser**

---

## 📁 Project Structure

```text
InstaRep_AI/
├── .gitignore              # Monorepo root gitignore
├── README.md               # Project documentation
├── Design.md               # Design guidelines & tokens
├── package.json            # Monorepo management scripts
│
├── client/                 # React Frontend
│   ├── .gitignore          # Client-specific gitignore
│   ├── index.html          # HTML Entrypoint
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── src/
│       ├── components/     # Modals, layout, and repository UI
│       ├── context/        # Auth and Repository state contexts
│       ├── pages/          # Dashboard, Repositories, Settings, etc.
│       └── services/       # Client API abstraction
│
└── server/                 # Express Backend API
    ├── .gitignore          # Server-specific gitignore
    ├── .env.example        # Environment variable template
    ├── .env                # Secret environment variables (ignored by git)
    └── src/
        ├── controllers/    # Route controllers
        ├── routes/         # Express routes (auth, repos, user)
        ├── services/       # GitHub API integration services
        └── server.js       # Express server initialization
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### 2. Installation
Clone the repository and install dependencies for the root, server, and client:

```bash
# Install root, client, and server dependencies in one command
npm run install:all
```

Or install individually:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Configure Server Environment
Create a `.env` file in the `server/` directory:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
GITHUB_CLIENT_ID=your_oauth_client_id       # Optional if using PAT or Demo Mode
GITHUB_CLIENT_SECRET=your_oauth_client_secret # Optional if using PAT or Demo Mode
SESSION_SECRET=gitstore_super_secret_jwt_key_2026
```

### 4. Configure Client Environment (For Deployment)
When deploying the frontend to platforms like Vercel, Netlify, or Render:

Create a `client/.env` file or configure Environment Variables in your hosting provider:
```env
# Point to your deployed backend server URL
VITE_API_URL=https://your-backend-service.onrender.com/api
```
*(In local development, `VITE_API_URL=/api` is used by default with the Vite proxy).*

### 5. Running the Application

To run both client and server concurrently:
```bash
npm run dev
```

Or run them in separate terminals:
```bash
# Terminal 1 - Backend (port 5000)
npm run dev:server

# Terminal 2 - Frontend (port 5173)
npm run dev:client
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Authentication Options

1. **Personal Access Token (PAT)**:
   - Click **Connect with GitHub** in the top navigation or settings.
   - Choose **Access Token (PAT)**.
   - Paste a GitHub PAT generated with `repo` and `user` scopes.
   - *The token will be stored in your browser's localStorage for subsequent sessions.*

2. **GitHub OAuth**:
   - Register a GitHub OAuth App at [GitHub Developer Settings](https://github.com/settings/developers).
   - Set Authorization Callback URL to `http://localhost:5000/api/auth/github/callback`.
   - Add your Client ID and Secret to `server/.env`.
   - Log in with 1-click via the **GitHub OAuth** tab.

3. **Interactive Demo Mode**:
   - Select **Demo Mode** in the connection dialog to immediately test repository creation, inspection, and metrics with mocked data.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs both backend and frontend concurrently |
| `npm run dev:server` | Starts the Express server with Nodemon on port `5000` |
| `npm run dev:client` | Starts Vite development server on port `5173` |
| `npm run install:all` | Installs dependencies across root, server, and client |
| `npm run build` | Builds the client application for production |

---

## 📄 License
ISC
