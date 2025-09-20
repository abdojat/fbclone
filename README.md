## fbclone

A Facebook-like social media front-end built with React. This project provides a modern, responsive UI for social features including authentication, user profiles, posts (create/like/comment), friends and friend-requests, real-time chat, notifications, and image uploads. The app is intended to be paired with a compatible REST + Socket.IO backend.

Key highlights

- Built with React 19 and Material UI for a responsive, accessible UI
- State management with Redux Toolkit
- Network requests via Axios (intercepts attach JWT from localStorage)
- Real-time chat and notifications via Socket.IO client
- Form handling with Formik and validation via Yup
- Image uploads and media handling supported

Live features overview

- Authentication (JWT) with persistent login using localStorage
- User profiles and profile pictures
- Post feed with likes, comments, and saved posts
- Friend requests, sent requests, and friend suggestions
- Real-time one-to-one chat and a recent-chats list
- Push-style notifications with mark-as-read support
- Image upload endpoint wired in for posts and avatars

Tech stack

- React 19
- Material UI (@mui/material, @mui/icons-material)
- Redux Toolkit (@reduxjs/toolkit, react-redux)
- Axios for HTTP requests
- Socket.IO client for realtime features
- Formik + Yup for forms and validation
- react-router-dom for routing

Project structure (important paths)

- src/
  - api/           API client and endpoint helpers (`src/api/api.js`, `src/api/endpoints.js`)
  - components/    Reusable UI components (posts, navigation, loaders, forms)
  - context/       Auth and Socket providers (`src/context/AuthContext.js`, `src/context/SocketContext.js`)
  - pages/         App pages (Home, Login, Register, Profile, Posts, Friends, Chat)
  - routes/        App router and private-route handling (`src/routes/AppRouter.js`)
  - store.js       Redux store configuration
  - AppProviders.js Root-level providers (Redux, Router, Auth, Socket)

Getting started

Prerequisites

- Node.js (LTS recommended, >=16) and npm
- A compatible backend API implementing the routes in `src/api/endpoints.js` and a Socket.IO server for realtime chat/notifications. By default the client expects the API at `http://127.0.0.1:5000/api` (see configuration below).

Install dependencies

```powershell
npm install
```

Configure the backend URL

By default the Axios client points at `http://127.0.0.1:5000/api`. To use a different backend URL, update the `baseURL` in `src/api/api.js`.

Start the development server

```powershell
npm start
```

Build for production

```powershell
npm run build
```

How authentication works (client-side)

- On login the backend should return a JWT. The app stores the token in `localStorage` under the key `token` and sets the Authorization header for subsequent requests.
- The `AuthContext` loads the current user at startup using `getMe()` and exposes `login`, `logout`, and helpers for saved posts.

Backend expectations

The front-end calls the routes exposed under `src/api/endpoints.js`. Important behaviors expected from the backend:

- JWT-based authentication endpoints: register, login, logout, and `/users/me` to fetch the current user
- REST endpoints for posts, comments, likes, users, friends, uploads, chat messages, and notifications
- A Socket.IO server to support real-time chat and notification events

Environment & configuration notes

- There is no .env-based configuration in the client by default. The simplest way to change the API base URL is to edit `src/api/api.js` and set `baseURL` to the backend address.
- The client relies on localStorage for the JWT token and the user `_id`.

Routing

The app uses React Router. Public routes include `/login`, `/register`, `/post/:postId`, and chat routes for direct chat views. The authenticated area is protected by a `PrivateRoute` and includes `/` (home), `/profile/:userId`, `/friends`, `/posts`, and `/change-password`.

Scripts

- `npm start` - start dev server
- `npm run build` - create production build in `build/`
- `npm test` - run test runner
- `npm run eject` - eject Create React App configuration

Testing and quality

- The project includes dependencies for the React Testing Library. Tests can be run with `npm test`.

Contribution

Contributions are welcome. Suggested workflow:

1. Fork the repository and create a feature branch.
2. Open a pull request with a clear description of the change.
3. Add or update tests for new behavior where appropriate.

Before contributing:

- Ensure no sensitive values (API keys, private tokens) are checked into source control.
- Keep the UI consistent with Material UI theming used across the app.

Troubleshooting

- If the app shows authentication issues, verify the backend is running, and that a valid JWT is present in `localStorage`.
- If realtime features fail, confirm the Socket.IO backend is reachable and configured to accept connections from the client origin.

License

No license is specified in this repository. Add a LICENSE file to clarify the intended license for the project.

Acknowledgements

This project was bootstrapped with Create React App and leverages several open-source libraries including Material UI, Redux Toolkit, Axios, Socket.IO, Formik, and Yup.
