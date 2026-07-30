# Veloura

Premium streetwear e-commerce platform — React frontend + Express API.

## Prerequisites

- **Node.js** >= 20
- **PostgreSQL** >= 14
- **npm** >= 9

## Environment variables

Copy `server/.env.example` to `server/.env` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Random 64-char hex string (`openssl rand -hex 64`) |
| `CLIENT_ORIGIN` | Dev | Frontend URL for CORS (default: `http://localhost:5173`) |
| `PORT` | No | API server port (default: `4000`) |
| `RESEND_API_KEY` | Yes | Resend transactional email API key ([resend.com/api-keys](https://resend.com/api-keys)) |
| `EMAIL_FROM` | Yes | Verified sender address in Resend |
| `ADMIN_EMAIL` | Seed | Admin account email for `npm run seed` |
| `ADMIN_PASSWORD` | Seed | Admin account password for `npm run seed` |
| `RAZORPAY_KEY_ID` | Yes | Razorpay test/live key ID ([dashboard.razorpay.com](https://dashboard.razorpay.com)) |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | Razorpay webhook secret |

Optional frontend variable:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api` | API base URL; set to full URL if frontend is on a different origin |

## Run locally

### 1. Install dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 2. Set up the database

```bash
# Push the Prisma schema to your PostgreSQL database
npm run server:prisma:push

# Seed an admin user + sample products/collections
npm run server:seed
```

Make sure `DATABASE_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are set in `server/.env` before seeding.

### 3. Start the API server

```bash
npm run server:dev
```

The API starts on `http://localhost:4000`.

### 4. Start the frontend dev server (separate terminal)

```bash
npm run dev
```

The frontend starts on `http://localhost:5173`. API requests to `/api/*` are proxied to the backend automatically.

### 5. Open the app

Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Build for production

```bash
# Build the frontend
npm run build

# Build the server
npm run server:build
```

### Serve via the Node.js server

```bash
cd server
NODE_ENV=production node dist/index.js
```

The server serves both the API and the built frontend from a single process.

### Deploy on a VM / VPS

1. Set up PostgreSQL and Node.js on the target machine.
2. Clone the repo, copy `server/.env` with production values.
3. Run the build steps above.
4. Use a process manager (systemd, PM2, Supervisor) to keep the server running.
5. (Recommended) Put Nginx / Caddy in front for TLS termination and caching:

**Nginx reverse-proxy example:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        # The Express app also serves static files, but you can also
        # point Nginx directly at the dist/ directory:
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### Deploy on Vercel

1. Push to a Git repository connected to Vercel.
2. Set the frontend root to `./` and the build command to `npm run build`.
3. Set `VITE_API_URL` to your deployed API URL.
4. Deploy the server separately (Railway, Render, Fly.io, or a VPS).

## Auth architecture

Authentication uses **httpOnly cookies** (`veloura.session`) set by the server. The cookie is:
- `HttpOnly` — not accessible from JavaScript (mitigates XSS token theft)
- `Secure` — only sent over HTTPS (enabled in production)
- `SameSite=Strict` — not sent on cross-site requests (mitigates CSRF)
- `Path=/api` — scoped to API routes

The frontend sends the cookie automatically with `credentials: 'include'`. No token storage or `Authorization` header is needed in the client code.
