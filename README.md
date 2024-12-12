# Climate Solutions App with EJS

## Project Description

This project builds upon PetProjectV2 by refactoring the application to utilize the EJS templating engine. This significantly enhances data presentation by rendering HTML views directly from the server, leading to improved user experience, maintainability, and dynamic content capabilities.

Key enhancements include:

*   **EJS Integration:**
    *   Refactored all views (originally `.html` files) to use the `.ejs` extension.
    *   Implemented EJS templating for dynamic content rendering, enabling server-side data insertion into HTML.
    *   Created a reusable `navbar.ejs` partial view for consistent navigation across all pages.

*   **Project Data Rendering:**
    *   Rendered project data in a clear and organized tabular format on the `/solutions/projects` page.
    *   Implemented detailed project views on `/solutions/projects/:id` pages, providing comprehensive information for each project.

*   **Improved Error Handling:**
    *   Enhanced 404 error handling with custom error messages, providing more context to the user based on the type of error encountered.

*   **Enhanced User Interface:**
    *   Streamlined the navbar with improved navigation links and removed the redundant "Sector" dropdown for a cleaner user experience.
    *   Integrated a random quote from the DummyJSON API on project detail pages to add visual interest and engagement.

## Technologies Used

*   **Node.js:** The runtime environment for executing JavaScript server-side.
*   **Express.js:** A fast, unopinionated web framework for Node.js.
*   **JavaScript:** The primary programming language for both front-end and back-end logic.
*   **JSON:** Data format used for storing and exchanging data between the server and client.
*   **EJS (Embedded JavaScript):** A simple templating language that generates HTML dynamically on the server.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom user interfaces with minimal custom CSS.
*   **DaisyUI:** A component library for Tailwind CSS, providing pre-built, customizable components for faster development.
*   **DummyJSON API:** Used to fetch random quotes for display on project detail pages.

## Key Features

*   **Dynamic Content Rendering:** EJS dynamically generates HTML for all views, including project lists, individual project details, and the "About" page, allowing for efficient data display.
*   **Improved User Experience (UX):** Enhanced navigation with a streamlined navbar and a more informative 404 error page contribute to a better user experience.
*   **Data-Driven Views:** Project data is displayed in a clear and concise table format on the projects list page, while detailed project information, including images, summaries, and external links, is presented on individual project pages.
*   **Random Quotes:** Integration of random quotes from the DummyJSON API adds a touch of personality and engagement to project detail pages.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd <project_directory>
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Build Tailwind CSS:**

    ```bash
    npm run build
    ```

5.  **Start the server:**

    ```bash
    npm start
    ```
