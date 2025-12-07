# Cows App - Serverless Edition 

## Overview
This application has been migrated to a fully **Serverless Architecture** using **Angular 16** (Frontend) and **Firebase** (Backend).
It no longer requires a separate Node.js server or PostgreSQL database. All data is stored in **Firestore**, and authentication is handled by **Firebase Auth**.

## Prerequisites
- **Node.js (v16+)**: Required if you want to run the project locally.
- **Angular CLI**: `npm install -g @angular/cli`
- **Firebase Account**: You need a free Firebase project.

## Architecture
- **Frontend**: Angular 16 (hosted on GitHub Pages or Firebase Hosting).
- **Database**: Cloud Firestore (NoSQL).
- **Authentication**: Firebase Authentication (Email/Password).
- **Hosting**: Serverless (no Render/Railway required).

## Setup & Installation

### 1. Configure Firebase Console
You **must** configure your Firebase project before the app will work.
👉 **See [cattle_install_guide.txt](./cattle_install_guide.txt) for step-by-step instructions.**

### 2. Local Development (Optional)
If you have Node.js installed locally:

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # If this fails with "command not found", you need to install Node.js.
    # Otherwise, rely on GitHub Actions for deployment.
    ```
3.  Start the app:
    ```bash
    ng serve
    ```
4.  Open `http://localhost:4200`.

### 3. Deployment (GitHub Actions)
This repository is configured to automatically deploy to GitHub Pages (or you can configure Firebase Hosting).
Just push your changes to the `main` branch.

## Project Structure
- `frontend/`: Contains the specific Angular source code.
- `backend/`: **REMOVED** (Obsolete).

## Documentation
- `cattle_install_guide.txt`: Detailed Firebase Setup Guide.
