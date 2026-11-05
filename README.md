# TaskWave: Client

**TaskWave** is a freelance marketplace where **clients** post tasks, **freelancers** send proposals, and every task moves through a clear lifecycle from brief to approved delivery. This repository is the React front end. It has a modern, responsive UI with a light/dark theme and a dedicated dashboard for each of the three user roles.

🔗 **Live site:** https://assignment-10-sarfaraz-akram.netlify.app/
🔗 **API (server) repo:** https://github.com/SarfarazAkram17/TaskWave-Server

---

## ✨ What's new in v2

- Complete UI redesign with a token-based design system (no UI-kit dependency)
- Light and dark themes with proper colour management, no flash on load
- Three role-based dashboards: **Client**, **Freelancer**, **Admin**
- A real workflow: proposals → accept → deliver → review → complete
- **Photo uploads** (Cloudinary) instead of image links, on sign-up and in the profile
- **Custom calendar** date picker (keyboard accessible, themed, mobile bottom sheet) instead of the browser's native date input
- **Profile dropdown** lists every dashboard link for your role, the same as the sidebar
- Fully responsive from **320px** up to large desktops
- Accessible by default: keyboard navigation, visible focus, ARIA labels, reduced-motion support

---

## 👥 Roles and dashboards

You choose a role when you sign up (client or freelancer). Admin accounts are created manually in the database (see the server README).

| Role           | Dashboard highlights                                                                                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Client**     | Stats (open / in progress / proposals to review / spent), tasks-per-month chart, status breakdown, "needs your attention" queue, recent tasks, post / edit / cancel / delete tasks, compare proposals, review deliveries |
| **Freelancer** | Earnings, active jobs, pending proposals, win rate, monthly earnings chart, proposal outcomes, **My proposals** (withdraw pending), **My jobs**, delivery form with revision feedback                                    |
| **Admin**      | Platform totals, new users and tasks charts, status breakdown, newest members, latest tasks, **Users** (search, filter, change role, suspend / reactivate), **All tasks** (search, filter, cancel, delete)               |

## 🔄 Workflow

```
Open ──► In progress ──► In review ──► Completed
  │            ▲              │
  └► Cancelled └─ changes ◄───┘
```

1. **Client posts a task** (title, category, budget, deadline, description).
2. **Freelancers send proposals** with their own price, delivery time and a cover message (one per task; can be withdrawn while pending).
3. **Client compares proposals and accepts one.** The task locks to that freelancer and the other proposals are marked "Not selected".
4. **Freelancer delivers** a note and an optional link.
5. **Client approves** (task completed) **or requests changes** (back to In progress with feedback).

Each task has a workspace page that shows the next action for whoever is viewing it.

## 🎨 Design system and themes

- All colours are CSS variables defined once in `src/index.css`, for both `light` and `dark`.
- Tailwind utilities (`bg-surface`, `text-muted`, `border-line`, `bg-primary-soft`, …) are mapped to those variables, so components never hard-code a colour.
- The theme is stored in `localStorage` (`taskwave-theme`), follows the operating system until you choose, and is applied by a tiny inline script in `index.html` before first paint.
- Toggle it from the header or **Profile → Appearance**.
- Typography: Bricolage Grotesque (headings) and Instrument Sans (body).
- Charts are accessible HTML/SVG with tooltips, keyboard focus and text alternatives; status colours always come with a text label.

## 📱 Responsive

Verified with no horizontal overflow at **320px, 768px and 1280px** in both themes. Tables become stacked cards on small screens, the dashboard sidebar becomes a slide-in drawer, and filters collapse behind a button.

## 🔐 Authentication

Firebase Authentication (email/password and Google). After sign-in the client loads the user's TaskWave profile from the API. New Google users pick a role on a short onboarding screen. Every API request sends the Firebase ID token; the server verifies it.

## 📅 Custom calendar

All date fields use the in-house `DatePicker` (`src/Components/ui/DatePicker.jsx`). Click the field to open the calendar, then pick a day, or use **Today**. It works with the keyboard (arrow keys move by day/week, PageUp/PageDown by month, Home/End to the start/end of the month, Enter to select, Esc to close), follows the light/dark theme, opens upwards when there is no room below, and becomes a bottom sheet on phones. Values are plain `YYYY-MM-DD` strings, and `min` / `max` disable days outside a range.

Used in: **Post a task** and **Edit task** (the _Deadline_ field, in `src/Pages/Dashboard/TaskForm.jsx`).

## 🧭 Role-based navigation

The links for each role live in one place, `src/lib/navigation.js`, and are used by both the dashboard sidebar and the profile dropdown (avatar menu in the header), so the two never drift apart.

| Role       | Links                                                        |
| ---------- | ------------------------------------------------------------ |
| Client     | Overview, Post a task, My tasks, Browse marketplace, Profile |
| Freelancer | Overview, Find work, My proposals, My jobs, Profile          |
| Admin      | Overview, Users, All tasks, Marketplace, Profile             |

## 🖼 Photo uploads

Everywhere the app needs a picture (sign-up and **Profile**), people **upload a file** (JPG, PNG or WebP, up to 5 MB); there is no image-link field. The client asks the server for a signed upload, sends the file straight to Cloudinary, and stores the returned URL. Avatars are served as small cropped, optimised copies. If you sign in with Google, your Google avatar is used until you upload your own. See the server README for the Cloudinary setup.

## 🧭 Routes

| Path                                                                      | Access                 | Purpose                                                     |
| ------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------- |
| `/`                                                                       | public                 | Landing page                                                |
| `/tasks`, `/tasks/:id`                                                    | public                 | Browse (search, filters, sort, pagination) and task details |
| `/login`, `/register`, `/onboarding`                                      | guests / new users     | Authentication                                              |
| `/dashboard`                                                              | signed in              | Role-specific overview                                      |
| `/dashboard/post-task`, `/dashboard/edit-task/:id`, `/dashboard/my-tasks` | client                 | Manage tasks                                                |
| `/dashboard/proposals`, `/dashboard/jobs`                                 | freelancer             | Proposals and jobs                                          |
| `/dashboard/tasks/:id`                                                    | owner, assignee, admin | Task workspace                                              |
| `/dashboard/users`, `/dashboard/tasks`                                    | admin                  | Moderation                                                  |
| `/dashboard/profile`                                                      | signed in              | Profile and appearance                                      |

Old v1 URLs (`/browseTasks`, `/addTask`, `/myPostedTasks`, …) redirect to the new ones.

## 🛠 Tech stack

React 19 · Vite 6 · Tailwind CSS 4 · React Router 7 · Firebase Auth 11 · Cloudinary (image hosting) · React Icons · React Toastify

Removed in v2: DaisyUI, SweetAlert2, React Tooltip and React Simple Typewriter (replaced by the in-house design system and a native `<dialog>` confirmation).

## 📁 Structure

```
src/
  Authentication/   AuthProvider (Firebase user + TaskWave profile/role)
  Components/       TaskCard, StatusStepper, ProposalForm, Footer, ui/* primitives (DatePicker, PhotoPicker, UserMenu, …)
  context/          ThemeProvider
  Layouts/          PublicLayout, DashboardLayout, AuthLayout
  lib/              api client, uploadImage (Cloudinary), navigation (role links), constants, formatters, useAsync
  Pages/            Home, Browse, TaskDetails, Auth/*, Dashboard/*
  Routes/           Router config and guards (RequireAuth, RequireRole)
```

## 🚀 Getting started

```bash
git clone https://github.com/SarfarazAkram17/TaskWave-Client.git
cd TaskWave-Client
npm install
cp .env.example .env.local   # fill in your Firebase config and VITE_API_URL
npm run dev
```

| Script            | What it does                  |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start the dev server          |
| `npm run build`   | Production build into `dist/` |
| `npm run preview` | Preview the production build  |
| `npm run lint`    | Run ESLint                    |

### Environment variables

| Variable                                                                                                         | Description                                                 |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `VITE_apiKey`, `VITE_authDomain`, `VITE_projectId`, `VITE_storageBucket`, `VITE_messagingSenderId`, `VITE_appId` | Firebase web app config                                     |
| `VITE_API_URL`                                                                                                   | TaskWave API base URL (defaults to the original deployment) |

Run the matching server from [TaskWave-Server](https://github.com/SarfarazAkram17/TaskWave-Server). It **must** be v2, because this client relies on its roles, proposals and workflow endpoints.

## ☁️ Deployment

Netlify (`public/_redirects` handles SPA routing) or Firebase Hosting (`firebase.json` is included).