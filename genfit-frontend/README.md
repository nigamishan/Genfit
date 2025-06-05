# Genfit Frontend

This project is a ReactJS frontend for the Genfit backend service.

## Setup

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the `genfit-frontend` directory and add the backend API URL:
    ```
    REACT_APP_API_BASE_URL=http://localhost:8080
    ```
4.  **Start the development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    This will run the app in development mode.
    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Features

-   User Authentication (Basic Auth)
-   User Profile Management
-   Progress Tracking with charts
-   Workout Plan Management

## Tech Stack

-   ReactJS
-   React Router
-   Material UI
-   Axios
-   Chart.js 