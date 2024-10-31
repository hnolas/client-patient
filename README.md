# Multi-App Project

This repository contains an Angular frontend and a Python FastAPI backend. Follow the instructions below to set up, install dependencies, and run both projects.

---

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Projects](#running-the-projects)
  - [Angular Project](#angular-project)
  - [Python Project (FastAPI)](#python-project-fastapi)
- [API Documentation](#api-documentation)

---

## Requirements

### Prerequisites
Make sure the following software is installed on your machine:
- **Node.js** (for Angular): [Download Node.js](https://nodejs.org/)
- **Python 3.8+** (for FastAPI): [Download Python](https://www.python.org/)

### Package Managers
- **npm** (comes with Node.js)
- **pip** (comes with Python)

---

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/project-repo-name.git
   cd project-repo-name
   ```

2. **Install Dependencies**

   - **For the Angular Project**:
     Navigate to the Angular project directory and install its dependencies:
     ```bash
     cd angular-project
     npm install
     cd ..
     ```

   - **For the Python Project**:
     Navigate to the Python project directory and install its dependencies using `requirements.txt`:
     ```bash
     cd python-project
     pip install -r requirements.txt
     cd ..
     ```

---

## Running the Projects

### Angular Project
To start the Angular project, follow these steps:

1. Navigate to the Angular project folder:
   ```bash
   cd angular-project
   ```

2. Start the Angular development server:
   ```bash
   ng serve --open
   ```

   This will automatically open the Angular app in your default browser at `http://localhost:4200`. If it doesn’t, you can manually visit this URL.

3. **Note**: If you need to run the Angular app on a different port, specify the port as follows:
   ```bash
   ng serve --port 4201
   ```

### Python Project (FastAPI)
To start the Python FastAPI backend, follow these steps:

1. Navigate to the Python project folder:
   ```bash
   cd python-project
   ```

2. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

   By default, the FastAPI server will run at `http://127.0.0.1:8000`.

---

## API Documentation

The FastAPI backend provides interactive API documentation, accessible at the following URLs once the server is running:

- **Swagger UI**: `http://127.0.0.1:8000/docs` - This provides a user-friendly, interactive interface for exploring and testing the API.
- **ReDoc**: `http://127.0.0.1:8000/redoc` - Another format for API documentation.

---

## Troubleshooting

If you encounter any issues, ensure that:
- All dependencies are correctly installed (`npm install` for Angular, `pip install -r requirements.txt` for Python).
- You’re using compatible versions of Node.js, npm, and Python.

---

## License

This project is licensed under the MIT License.
