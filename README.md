# 📚 Quizlex

![License](https://img.shields.io/github/license/IvanYakunkin/Quizlex)
![CI/CD](https://img.shields.io/github/actions/workflow/status/IvanYakunkin/Quizlex/main.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)

**Quizlex** is a free, open-source web application designed to help you master foreign languages and new concepts using flashcards. Inspired by platforms like Quizlet, Quizlex offers a clean, ad-free experience focused on efficiency and learning.

🚀 **Live Demo:** [https://quizlex.ru](https://quizlex.ru)    
📄 **RU Version:** [https://github.com/IvanYakunkin/Quizlex/blob/main/README-RU.md](https://github.com/IvanYakunkin/Quizlex/blob/main/README-RU.md)        
📸 **Photos/Videos** [https://github.com/IvanYakunkin/Quizlex/tree/main/DEMO](https://github.com/IvanYakunkin/Quizlex/tree/main/DEMO)

---

## 🌟 Features

Quizlex is designed to be useful immediately, even without an account.

### 🔓 For Guests (No Registration Required)
* **🔄 Smart Import:** Easily import study sets/modules from other popular flashcard applications.
* **🧠 Study Modes:** Dive straight into learning imported modules.
* **⭐ Favorites:** Mark specific cards as "Favorites" to focus on difficult terms.
* **🔐 Seamless Auth:** Sign up securely via Email/Password or Google OAuth (NextAuth).

### 👤 For Registered Users
* **✍️ Create Modules:** Build your own custom study sets from scratch.
* **🛠️ Edit & Manage:** Update your cards and organize your personal library.
* **📚 Personal Library:** Save modules to your profile for long-term study access.

---

## 🎓 Study Modes

We currently support three distinct ways to learn:

1.  **🃏 Flashcards:** The classic flip-card experience to memorize terms.
2.  **📝 Test:** A generated quiz to evaluate your knowledge.
3.  **⌨️ Write:** Type the answer to reinforce spelling and recall.
4.  **⚡ Match:** Connect terms with their definitions by tapping on the matching pairs.


---

## 🛠️ Tech Stack

This project is built with a modern, type-safe stack ensuring performance and scalability:

* **Frontend & Framework:** [Next.js](https://nextjs.org/) (App Router), React
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** MySQL
* **ORM:** [Prisma](https://www.prisma.io/)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/)
* **Testing:** Vitest (Unit & Integration), Playwright (E2E)
* **CI/CD:** GitHub Actions (Automated testing and deployment)
* **Infrastructure:** VPS (Ubuntu, Nginx, PM2)

---

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/IvanYakunkin/Quizlex.git
    cd Quizlex
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your database credentials and auth secrets:
    ```env
    DATABASE_URL="mysql://username:password@hostname:port/dbname"
    DATABASE_USER=your_username
    DATABASE_PASSWORD=your_password
    DATABASE_NAME=your_database
    DATABASE_HOST=db_host
    DATABASE_PORT=db_port
    NEXTAUTH_SECRET=your_super_secret
    NEXTAUTH_URL=http://localhost:3000
    GOOGLE_ID=your_google_id
    GOOGLE_SECRET=your_google_secret
    ```

4.  **Setup Database:**
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🧪 Testing

The project includes a comprehensive test suite to ensure stability:

* **Unit & Integration Tests:** Powered by **Vitest**. Test core logic, utility functions, and component interactions.
* **E2E (End-to-End) Testing:** Powered by **Playwright**. Simulate real user journeys, including authentication flows and study session transitions.
* **CI Integration:** All tests are automatically executed on every push via GitHub Actions.

## 🤝 Contributing

Contributions are welcome!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
