# Book Inventory Management System

## 1. Project Title and Description

The **Book Inventory Management System** is a robust, full-stack web application meticulously crafted to provide a secure and efficient platform for managing a comprehensive collection of books. It empowers administrators with granular control over user accounts and offers intuitive tools for cataloging, tracking, and maintaining book records. Designed for scalability and ease of use, this system streamlines inventory operations and enhances data accessibility for both administrative and standard users.

## 2. Features

This system offers a rich set of features designed to provide a complete book inventory management solution:

- **Secure User Authentication & Authorization:**

  - Streamlined User Registration and Login processes.
  - **Role-Based Access Control (RBAC):** Differentiated access levels ensure that administrators have full control over user management, while standard users can manage book records within their permissions.
  - Protected Routes: Guarantees data integrity and secure access to sensitive functionalities and resources.

- **Comprehensive Book Management:**

  - **CRUD Operations:** Full capabilities to Create, Read, Update, and Delete book records.
  - Detailed Book Cataloging: Capture essential metadata including title, author, ISBN, publication year, genre, and more.
  - **Advanced Search and Filtering:** Efficiently locate books based on various criteria, enhancing data retrieval.
  - Pagination: Optimized display for navigating large book collections seamlessly.

- **User Administration (Admin Role):**

  - Centralized User Listing: Provides administrators with a comprehensive view and management capabilities for all registered user accounts.
  - User Role Management: Ability to assign and modify user roles to control access permissions.

- **Dashboard & Analytics:**

  - Key Performance Indicators (KPIs): Offers an insightful overview of critical statistics such as total books, registered users, and other relevant inventory metrics.

- **AI-Powered Content Enhancement (via Gemini API):**
  - Leverages advanced AI capabilities for potential features such as automated generation of book descriptions, summaries, or intelligent metadata suggestions, significantly enriching data quality and user experience.

## 3. Tech Stack

This project is engineered using a modern MERN (MongoDB, Express.js, React, Node.js) stack, augmented with TypeScript for enhanced code quality and Tailwind CSS for rapid, utility-first styling.

### Frontend

- **React.js:** A declarative, component-based JavaScript library for building dynamic user interfaces.
- **TypeScript:** A strongly typed superset of JavaScript that compiles to plain JavaScript, improving code maintainability and catching errors early.
- **Vite:** A next-generation frontend tooling that provides an extremely fast development server and optimized build performance.
- **Tailwind CSS:** A highly customizable, utility-first CSS framework that enables rapid UI development directly in markup.

### Backend

- **Node.js:** A high-performance JavaScript runtime environment built on Chrome's V8 engine, ideal for scalable server-side applications.
- **Express.js:** A minimalist and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **Mongoose:** An elegant MongoDB object modeling tool for Node.js, simplifying data interaction and schema definition.

### Database

- **MongoDB:** A leading NoSQL document database, chosen for its flexibility, scalability, and high performance, perfectly suited for handling diverse book and user data.

## 4. Installation Instructions

To set up and run the Book Inventory Management System locally, please follow these detailed steps:

### Prerequisites

- **Node.js:** (LTS version recommended) - Download and install from [nodejs.org](https://nodejs.org/).
- **npm:** (Node Package Manager) - Typically installed automatically with Node.js.
- **MongoDB:** Ensure you have a MongoDB instance running locally or accessible via a cloud service (e.g., MongoDB Atlas). Download and install from [mongodb.com](https://www.mongodb.com/try/download/community).

### Steps

1.  **Clone the Repository:**
    Begin by cloning the project repository to your local machine:

    ```bash
    git clone https://github.com/Deepak-157/Book-Inventory-Management-System.git
    cd book-inventory-management
    ```

2.  **Backend Setup:**
    Navigate to the `server` directory, install the necessary Node.js dependencies, and configure environment variables.

    ```bash
    cd server
    npm install
    ```

    Create a `.env` file in the `server` directory and populate it with the following essential environment variables:

    ```
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/bookinventory
    JWT_SECRET=your_super_secret_jwt_key_here
    ```

    - `PORT`: The port on which the backend server will listen.
    - `MONGODB_URI`: Your MongoDB connection string. Adjust if your MongoDB instance is not local or uses a different port/database name.
    - `JWT_SECRET`: A strong, unique secret key used for signing JSON Web Tokens. **Ensure this is a complex, randomly generated string for production environments.**

3.  **Frontend Setup:**
    Navigate to the `client` directory, install its dependencies, and configure its environment variables.
    ```bash
    cd ../client
    npm install
    ```
    Create a `.env` file in the `client` directory with the following configuration:
    ```
    VITE_API_URL=http://localhost:5000
    ```
    - `VITE_API_URL`: The base URL for your backend API. Ensure this matches the `PORT` configured in your backend's `.env` file.

## 5. Deployment Link

[Live Application](https://book-inventory-management-system-jjzr-6ev11rs4d.vercel.app)

## 6. Usage Instructions

### Running the Application

To launch the full-stack application, you will need to start both the backend server and the frontend development server concurrently.

1.  **Start the Backend Server:**
    Open your first terminal window, navigate to the `server` directory, and execute:

    ```bash
    npm run dev
    ```

    The backend server will typically start on `http://localhost:5000` (or the port specified in your `server/.env` file).

2.  **Start the Frontend Development Server:**
    Open a _second_ terminal window, navigate to the `client` directory, and execute:
    ```bash
    npm run dev
    ```
    The frontend application will automatically open in your default web browser, usually at `http://localhost:5173`.

### Seeding Initial Data (Optional)

To populate your database with initial administrative users and sample book data, you can run the seeding scripts. Ensure your MongoDB server is running and the backend is configured.

1.  **Seed Admin User:**
    ```bash
    cd server
    node utils/seedAdmin.js
    ```
2.  **Seed Sample Books:**
    ```bash
    cd server
    node utils/seedBooks.js
    ```

### Testing the Application

While comprehensive automated test suites are not yet fully integrated, the application has been developed with modularity and testability in mind to facilitate future test integration. Manual testing can be performed effectively by interacting with the application through the browser, verifying all functionalities and user flows.

## 7. API Endpoints Overview

The backend exposes a set of well-defined RESTful API endpoints for interacting with the Book Inventory Management System:

| HTTP Method | Endpoint             | Description                                                                        | Access Level  |
| :---------- | :------------------- | :--------------------------------------------------------------------------------- | :------------ |
| `POST`      | `/api/auth/register` | Registers a new user account.                                                      | Public        |
| `POST`      | `/api/auth/login`    | Authenticates a user and returns a JWT for subsequent requests.                    | Public        |
| `GET`       | `/api/books`         | Retrieves a list of all books, with support for search, filtering, and pagination. | Authenticated |
| `GET`       | `/api/books/:id`     | Retrieves detailed information for a specific book by its ID.                      | Authenticated |
| `POST`      | `/api/books`         | Adds a new book record to the inventory.                                           | Authenticated |
| `PUT`       | `/api/books/:id`     | Updates an existing book record identified by its ID.                              | Authenticated |
| `DELETE`    | `/api/books/:id`     | Deletes a book record from the inventory by its ID.                                | Authenticated |
| `GET`       | `/api/users`         | Retrieves a list of all registered users.                                          | Admin Only    |

## 8. Folder Structure

The project is organized into two primary directories, `client` and `server`, reflecting its full-stack architecture:

```
book-inventory-management/
├── client/                 # Frontend application built with React, TypeScript, and Vite.
│   ├── public/             # Static assets served directly by the web server.
│   ├── src/                # Contains the core source code for the React application.
│   │   ├── assets/         # Static assets like images and icons.
│   │   ├── components/     # Reusable UI components, categorized by feature (Auth, Books, Common, Dashboard, Layout).
│   │   ├── context/        # React Context API for managing global state (e.g., AuthContext, BookContext).
│   │   ├── hooks/          # Custom React hooks for encapsulating reusable logic.
│   │   ├── pages/          # Top-level components representing distinct application views (e.g., Authentication, Books, Dashboard, Users).
│   │   ├── services/       # Modules responsible for interacting with the backend API (e.g., authService, bookService, geminiService, userService).
│   │   ├── types/          # TypeScript type definitions for data structures and interfaces.
│   │   └── utils/          # Frontend utility functions and helpers.
│   ├── package.json        # Defines frontend dependencies and development scripts.
│   └── tsconfig.json       # TypeScript compiler configuration for the frontend.
├── server/                 # Backend application built with Node.js and Express.js.
│   ├── controllers/        # Contains the business logic and request handlers for API routes.
│   ├── middleware/         # Express middleware functions (e.g., authentication, authorization).
│   ├── models/             # Mongoose schemas and models defining the database structure (e.g., Book, User).
│   ├── routes/             # Defines the API endpoints and maps them to controller functions.
│   ├── utils/              # Backend utility functions, including database seeding scripts (seedAdmin, seedBooks).
│   ├── package.json        # Defines backend dependencies and server-side scripts.
│   └── server.js           # The main entry point for the Node.js backend server.
├── .gitignore              # Specifies files and directories to be ignored by Git.
└── README.md               # This project documentation file.
```

## 9. Credits / Acknowledgements

This project was conceptualized and developed by **Deepak Goyal**.

Special thanks to the open-source community and the creators/maintainers of the libraries and frameworks that made this project possible.
