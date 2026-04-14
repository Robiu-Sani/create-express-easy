# 🚀 Complete Setup Guide for `marn-express-initializer`

This guide provides a comprehensive walkthrough for setting up the **MARN Express Initializer** by **Robius Sani** for the **Code Biruni** ecosystem. This tool scaffolds a production-ready MERN (Express.js) backend with authentication, file uploads, email services, and more.

## 📋 Prerequisites: Folder & Terminal Setup

Before initializing the project, you must navigate to the directory where you want to create your application.

### Step 1: Open Your Terminal
- **Windows**: Open **Command Prompt** (cmd), **PowerShell**, or **Windows Terminal**.
- **macOS / Apple**: Open **Terminal** (found in Applications > Utilities).
- **Linux**: Open your default terminal emulator (Ctrl+Alt+T on most distros).

### Step 2: Navigate to Your Projects Folder
Use the `cd` (change directory) command to go to your desired location.
```bash
# Example: Navigating to a "Projects" folder on the Desktop
cd Desktop/Projects
```
> **Note**: If the folder does not exist, create it using `mkdir YourFolderName` first, then `cd` into it.

---

## 📦 Step 3: Installing Node.js (If Not Installed)

This project requires **Node.js** (which includes `npm` and `npx`). Follow the instructions below for your operating system if you do not have Node.js installed.

### How to Check if Node.js is Installed
Run this command in your terminal:
```bash
node --version
```
If you see a version number (e.g., `v18.17.0`), you are ready. If you see `command not found`, follow the steps below.

### Installation Steps by Operating System

| OS | Installation Guide |
| :-- | :-- |
| **Windows** | 1. Visit the official [Node.js website](https://nodejs.org/).<br>2. Download the **LTS (Long-Term Support)** installer (`.msi` file).<br>3. Run the installer and follow the setup wizard (default settings are sufficient).<br>4. Restart your terminal to ensure `node` and `npm` commands are recognized. |
| **macOS / Apple** | **Option 1: Official Installer**<br>1. Download the **macOS Installer** (`.pkg`) from [Node.js website](https://nodejs.org/).<br>2. Run the package and follow the prompts.<br><br>**Option 2: Homebrew (Recommended for developers)**<br>1. If you have [Homebrew](https://brew.sh/), simply run:<br>`brew install node` |
| **Linux (Ubuntu/Debian)** | 1. Update package list: `sudo apt update`<br>2. Install Node.js and npm:<br>`sudo apt install nodejs npm`<br><br>*For the latest version, consider using NodeSource PPA or [NVM](https://github.com/nvm-sh/nvm) (Node Version Manager).* |

**Verify Installation:**
After installation, close and reopen your terminal, then run:
```bash
node --version
npm --version
```

---

## 🧪 Step 4: Initializing the MARN Express Project

Now that you are in the correct folder and Node.js is installed, run the initializer command.

```bash
npx marn-express-initializer project-name
```
*(Replace `project-name` with the actual name of your application, e.g., `my-backend-api`)*

This command downloads the template and sets up the file structure automatically.

---

## 📁 Step 5: Navigate into the Project

After the initialization completes, move into the newly created project directory:

```bash
cd project-name
```
*(Replace `project-name` with the name you used in the previous step)*

---

## ⚙️ Step 6: Environment Variables Setup

The project relies on a `.env` file to store sensitive credentials (Database URL, API keys, etc.).

1.  Locate the `.env.example` file in your project root.
2.  Create a copy and rename it to `.env`.
    - **Linux/macOS**: `cp .env.example .env`
    - **Windows**: `copy .env.example .env`
3.  Open the `.env` file in your code editor (e.g., VS Code).

**Documentation Reference:**
For detailed explanations of **every environment variable** (including `PORT`, `MONGO_URI`, `JWT_SECRET`, and `CLOUDINARY` settings), please refer to the official documentation:

👉 **[Environment Variables Full Documentation](https://github.com/Robiu-Sani/marn-express-initializer/blob/main/env-doc.md)**

> **Important**: Fill in all required fields in the `.env` file, especially `MONGO_URI`, otherwise the server will not start correctly.

---

## 🏃 Step 7: Run the Development Server

Once the `.env` file is configured, you can start the server:

```bash
npm run dev
```

You should see output indicating the server is running and connected to the database.

---

## 📚 Additional Notes & Documentation Links

This initializer includes many advanced modules out of the box. Below are helpful links and notes for further configuration.

### 🔗 Important Documentation Links
- **Previous**: [Main GitHub Repository](https://github.com/Robiu-Sani/marn-express-initializer/)
- **Next / Env Setup**: [Environment Variables Guide](https://github.com/Robiu-Sani/marn-express-initializer/blob/main/env-doc.md)

### 📝 Key Notes for Development
- **Module Structure**: The project follows a modular pattern. Place new features inside the `src/modules/` directory.
- **Uploading Files**: The project is pre-configured for **Cloudinary**. Ensure you set the `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in your `.env` file to enable image uploads.
- **Email Sending**: The mailer uses Nodemailer. Configure the `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS` variables.
- **Building for Production**: When ready to deploy, run:
    ```bash
    npm run build
    npm run start
    ```

### 🛠️ Troubleshooting
- **Error: `npx` not found**: Ensure you installed Node.js correctly. Try closing and reopening your terminal.
- **Port already in use**: Change the `PORT` variable in your `.env` file (e.g., `PORT=5000`).
- **MongoDB Connection Error**: Verify your IP address is whitelisted in MongoDB Atlas or that your local MongoDB service is running.

By following this guide, you have successfully set up a robust Express.js backend ready for development. Happy coding!
