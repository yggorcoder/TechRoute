# TechRoute - Visit Management System

TechRoute is a comprehensive management system designed to streamline the scheduling, tracking, and reporting of technical field visits. It features a FastAPI backend and a React frontend.

## Features

- **Visit Dashboard:** A central dashboard to view all scheduled and ongoing technical visits at a glance.
- **Visit Registration:** Easily register new visits with details such as date, time, location, technician, and service type.
- **Advanced Status Management:** Track the lifecycle of each visit with the following statuses:
  - `SCHEDULED`
  - `IN_PROGRESS`
  - `COMPLETED`
  - `RESCHEDULED`
  - `CANCELLED`
- **Full Status History:** Every status change is timestamped and logged. Comments can be added to provide context for each update.
- **Rescheduling:** Seamlessly reschedule visits to a new date and time. The change is automatically logged in the visit's history.
- **Post-Visit Notes:** Technicians can add detailed observations after a visit is complete. The system maintains a full, timestamped history of all notes.

## Tech Stack

- **Backend:** Python 3, FastAPI
- **Frontend:** React (with Vite), JavaScript
- **Styling:** Basic CSS with responsive design for modals and cards.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Git
- Python 3.10+
- Node.js and npm

### Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yggorcoder/TechRoute.git
   cd TechRoute
   ```

2. **Backend Setup:**
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
   - Install the required Python packages:
     ```sh
     pip install -r requirements.txt
     ```
   - Run the backend server (from the `server` directory):
     ```sh
     uvicorn main:app --reload
     ```
   - The backend will be running at `http://127.0.0.1:8000`.

3. **Frontend Setup:**
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

## API Endpoints

The following API endpoints have been implemented:

- `GET /visits`: Retrieves a list of all visits.
- `POST /visits`: Creates a new visit.
- `PATCH /visitas/{visit_id}/status`: Updates the status of a specific visit.
- `PATCH /visitas/{visit_id}/notas`: Adds a new post-visit note to a specific visit.
