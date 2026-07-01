# MERN Task Manager

A MERN application for basic task management.

![App Image]

<img width="1122" height="686" alt="image" src="https://github.com/user-attachments/assets/65d247a9-9cd9-4957-b0dc-1595fc122ee1" />

---

## Table of Contents

- [Features](#features)  
- [Tools and Technologies](#tools-and-technologies)  
- [Dependencies](#dependencies)  
- [Dev-dependencies](#dev-dependencies)  
- [Prerequisites](#prerequisites)  
- [Installation and Setup](#installation-and-setup)  
- [Backend API](#backend-api)  
- [Frontend Pages](#frontend-pages)  
- [NPM Scripts](#npm-scripts)  
- [Useful Links](#useful-links)  
- [Contact](#contact)  

---

## Features

### User-side features
- Signup, Login, Logout  
- Add, View, Update, Delete tasks  

### Developer-side features
- Toasts for success and error messages  
- Form validations in frontend and backend  
- Fully Responsive Navbar  
- Token-based Authentication  
- 404 page for wrong URLs  
- Relevant redirects  
- Global user state using Redux  
- Custom loaders and layout component  
- Theme colors applied via Tailwind CSS (no external CSS)  
- Tooltips usage  
- Dynamic document titles  
- Redirect to previous page after login  
- Use of various React hooks, including custom `useFetch` hook  
- Routes protection and backend middleware for user verification  
- Use of different HTTP status codes for responses  
- Follows standard best practices  

---

## Tools and Technologies

- HTML, CSS, JavaScript  
- Tailwind CSS  
- Node.js, Express.js  
- React.js, Redux  
- MongoDB  

---

## Dependencies

Major dependencies:

- axios  
- react, react-dom  
- react-redux, redux, redux-thunk  
- react-router-dom  
- react-toastify  
- bcrypt  
- cors  
- dotenv  
- express  
- jsonwebtoken  
- mongoose  

---

## Dev-dependencies

- nodemon  
- concurrently  

---

## Prerequisites

- Node.js installed
- Create a .env file inside the backend folder. Add credentials from .env.example.

Start the application:

npm run dev


Open http://localhost:3000 in your browser.

Backend API
Method	Endpoint	Description
POST	/api/auth/signup	Register new user
POST	/api/auth/login	Login user
GET	/api/tasks	Get all tasks
GET	/api/tasks/:taskId	Get a single task
POST	/api/tasks	Create a new task
PUT	/api/tasks/:taskId	Update a task
DELETE	/api/tasks/:taskId	Delete a task
GET	/api/profile	Get logged-in user info
Frontend Pages

/ – Home (Public for guests, private dashboard for users)

/signup – Signup page

/login – Login page

/tasks/add – Add new task

/tasks/:taskId – Edit a task

NPM Scripts

At root:

npm run dev – Start backend & frontend

npm run dev-server – Start backend only

npm run dev-client – Start frontend only

npm run install-all – Install all dependencies

Frontend folder:

npm start – Start frontend development server

npm run build – Build frontend for production

npm test – Run tests

npm run eject – Remove single build dependency

Backend folder:

npm run dev – Start backend with nodemon

npm start – Start backend without nodemon

Useful Links

Project Repo: GitHub

Official Docs:

React

NPM

MongoDB

GitHub

Youtube Tutorials:

Express.js

React.js

Redux

Downloads:

Node.js

VS Code

Cheatsheets:

Git

VS Code Shortcuts

CSS Selectors

Contact

Himanshu Verma – [GitHub](https://github.com/himanshuV09/simple-task-manager-app)
- MongoDB database setup  
- Code editor (recommended: VS Code)  

---


