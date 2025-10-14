# TechRoute - Advanced Visit Management System

TechRoute is a full-stack application designed to streamline the scheduling, tracking, and management of technical field visits. It features a robust FastAPI backend and a dynamic React frontend, providing a comprehensive solution for service-oriented businesses.

## Key Features

- **Role-Based Authentication:** Secure JWT-based authentication system with distinct roles (`manager`, `technician`), each with specific permissions.
- **Dual-View Dashboard:**
  - **Visits Dashboard:** A powerful, interactive dashboard displaying all visits as cards. Features include filtering by technician/status and drag-and-drop sorting.
  - **Weekly Calendar Dashboard:** A 14-day calendar view showing all scheduled visits, providing a clear overview of the upcoming schedule.
- **Comprehensive Visit Management:**
  - **Creation:** Easily register new visits with customer details, service type, assigned technician, and more.
  - **Status Tracking:** A full lifecycle for visits, including `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, and `RESCHEDULED`.
  - **Detailed Modals:** Click any visit to open a detailed view with its full history, technician notes, and service checklists.
- **Service Checklists:** Create custom checklists for visits, and view completed items in the visit details.
- **Technician Notes:** Technicians can add timestamped notes to visits, creating a complete log of actions taken.
- **PDF Report Generation:** For completed visits, generate a downloadable PDF summary report directly from the dashboard.

## Tech Stack

- **Backend:**
  - Python 3
  - FastAPI
  - Passlib (for password hashing)
  - python-jose (for JWT creation and validation)
  - Uvicorn (for serving the application)

- **Frontend:**
  - React (with Vite)
  - React Router
  - Axios (for API communication)
  - `@dnd-kit` (for drag-and-drop functionality)
  - `@react-pdf/renderer` (for client-side PDF generation)
  - Bootstrap (for styling and components)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- Python 3.10+
- Node.js and npm
- Git

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd TechRoute_v4_base
    ```

2.  **Backend Setup:**
    - Navigate to the server directory:
      ```sh
      cd server
      ```
    - Create and activate a virtual environment:
      ```sh
      # For Windows
      python -m venv venv
      .\venv\Scripts\activate
      
      # For macOS/Linux
      python3 -m venv venv
      source venv/bin/activate
      ```
    - Install the required Python packages from `requirements.txt`:
      ```sh
      pip install -r requirements.txt
      ```
    - Run the backend server (from the `server` directory):
      ```sh
      uvicorn main:app --reload
      ```
    - The backend will be running at `http://127.0.0.1:8000`.

3.  **Frontend Setup:**
    - Open a **new terminal** and navigate to the client directory:
      ```sh
      cd client
      ```
    - Install the required npm packages:
      ```sh
      npm install
      ```
    - Run the frontend development server:
      ```sh
      npm run dev
      ```
    - The frontend will be accessible at `http://localhost:5173` (or another port if 5173 is busy).

## Usage

The application comes with two pre-populated users in the in-memory database for immediate testing.

- **Manager Account:**
  - **Username:** `manager`
  - **Password:** `manager_password`
  - This user can see all visits from all technicians.

- **Technician Account:**
  - **Username:** `technician`
  - **Password:** `tech_password`
  - This user can only see visits assigned to them.

You can also register new users through the application's sign-up page. **Note:** Since the backend uses a temporary in-memory database, all registered users will be lost when the Python server restarts. The default users above will be recreated on every restart.