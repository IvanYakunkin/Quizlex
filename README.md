# Quizlex

This application is designed to help users learn foreign language words through interactive flashcards. Built with React, Next.js, MySQL, and Prisma, this app provides an efficient and user-friendly way to enhance your vocabulary skills.

## Features

- **Free Vocabulary Creation and Import**: Easily create and import vocabulary cards (flashcards) for various languages.
- **Multiple Study Modes**: Learn through different modes including:
  - **Test Mode**: Challenge yourself with quizzes.
  - **Flashcards**: Review words using a traditional flashcard approach.
  - **Writing Mode**: Practice writing words to reinforce learning.
- **No Registration Required**: Start learning right away without needing an account.
- **User Registration**: Create an account to:
  - Import vocabulary modules.
  - Create an unlimited number of your own custom modules for personalized learning.

---

## Getting Started

To get started with the Foreign Language Vocabulary Trainer, follow these steps:

### Prerequisites

1. **Node.js and npm**: Make sure you have [Node.js](https://nodejs.org/) installed on your machine. This project is built using Node.js and npm (Node Package Manager).
2. **MySQL**: You need a MySQL database set up. Please install [MySQL](https://www.mysql.com/) if you haven't already.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install Dependencies**:
   Navigate to the project directory and run:
   ```bash
   npm install
   ```

3. **Set Up the Database**:
   - Create a new MySQL database.
   - Update the database connection settings in your `.env` file:
     ```
     DATABASE_URL="mysql://admin:127001@localhost:3306/Quizlex"
     ```

4. **Run Migrations**:
   Use Prisma to set up the database schema:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the Development Server**:
   Run the following command to start your local development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` to see the application in action.

---


## Technologies Used

- React.js
- Next.js
- MySQL
- Prisma

## Contributing

Contributions are welcome!

---

Feel free to customize any part of this description to better match your style or specific project details!
