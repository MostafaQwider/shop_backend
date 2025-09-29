# shop_backend
Node.js + Express backend (MVC + Service Layer) with PostgreSQL. Includes JWT authentication, user management, categories, products (variants, images, translations), orders, and reviews — ready-to-use template.
Shop Backend — Node.js + Express (MVC + Service Layer)

A backend built with Node.js + Express using a clean MVC architecture and Service Layer, connected to a PostgreSQL database.
Designed for a simple e-commerce system — including authentication, user management, categories, products (with variants, images, translations), orders, and reviews.

🚀 Features

Organized architecture: Controllers / Services / Models

PostgreSQL integration using pg and parameterized queries (SQL injection safe)

JWT authentication (login, register, protected routes)

User CRUD with roles & addresses

Category & Product management (supports variants, images, translations)

Orders & Reviews

Environment variables with dotenv

Ready to extend and deploy

📦 Tech Stack

Node.js + Express

PostgreSQL (via pg driver + connection pooling)

JWT for authentication

dotenv for environment configuration

⚙️ Setup & Run

Clone the repo:

git clone https://github.com/your-username/shop-backend.git
cd shop-backend


Install dependencies:

npm install


Set up .env file:

PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/yourdbname
JWT_SECRET=your_secret_key


Run the server:

npm start
