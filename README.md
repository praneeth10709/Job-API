**Job-API**

Job-API is a RESTful backend service built with Node.js, Express.js, and MongoDB. It is designed to manage job listings and user accounts, providing a secure and scalable solution for handling authentication, job management, and API interactions.

**Features**
User Authentication: Secure registration and login functionality using hashed passwords.
CRUD Operations for Jobs: Create, Read, Update, and Delete job listings.
MongoDB Integration: Stores users and jobs in a NoSQL database for flexible data handling.
Modular Structure: Organized into controllers, routers, models, and middleware for clean and maintainable code.
Middleware Support: Includes request validation, error handling, and authentication checks.
Environment Configuration: Uses .env file to manage sensitive data such as database URI and secret keys.
Deployment Ready: Configured with a Procfile for easy deployment to platforms like Heroku.

**Project Structure**
Job-API/
├─ controllers/    # Business logic for user and job operations
├─ routers/        # API routes for users and jobs
├─ models/         # MongoDB schemas (User, Job)
├─ middleware/     # Validation, authentication, error handling
├─ db/             # MongoDB connection setup
├─ errors/         # Custom error handlers
├─ app.js          # Application entry point
├─ package.json    # Project dependencies
├─ .env            # Environment variables
└─ Procfile        # Deployment configuration

**Getting Started**
**Clone the repository
git clone https://github.com/praneeth10709/Job-API.git
cd Job-API**

**Install dependencies
npm install**

**Set up environment variables in .env
PORT – Server port
MONGODB_URI – Your MongoDB connection string
JWT_SECRET – Secret key for JWT authentication**

**Run the server
npm start**


API Endpoints

**User Routes**
POST /register → Register a new user
POST /login → Login and receive JWT token

**Job Routes**
GET /jobs → List all jobs
POST /jobs → Create a new job (authenticated)
PUT /jobs/:id → Update a job by ID (authenticated)
DELETE /jobs/:id → Delete a job by ID (authenticated)


**Technologies Used**
Node.js – JavaScript runtime
Express.js – Web framework
MongoDB – NoSQL database
Mongoose – MongoDB ODM for schema management
dotenv – Environment variable management
bcrypt – Password hashing
JWT (JSON Web Token) – Authentication
