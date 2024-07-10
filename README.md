![alt text](image.png)

# FloraFinder Backend Documentation

## Introduction

Welcome to the FloraFinder Backend repository!

The FloraFinder backend provides a robust API for managing user accounts, authentication, and collections of plant discoveries. The backend is hosted on AWS, uses MySQL for database management, and is rendered using PM2 for process management.

## Installation and Setup

### Prerequisites

This minimum versions of the following need to be installed:

- Node.js: v22.3.0
- MySQL: Ver 8.0.37-0ubuntu0.24.04.1 for Linux on x86_64 ((Ubuntu))
- PM2: 5.4.1

### Clone the Repository

Clone or download this repository to your local machine:

```sh
git clone https://github.com/Esther299/Flora-Finder-BE.git
cd Flora-Finder-BE
```

### Install Dependencies

Install the required packages using the command:

```sh
npm install
```

### Environment Variables

Create a .env file in the root of the repository and add the following variables:

```sh
AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
DB_HOST=<your_database_host>
DB_PORT=<your_database_port>
DB_USER=<your_database_user>
DB_PASSWORD=<your_database_password>
DB_NAME=<your_database_name>
JWT_SECRET_KEY=<your_jwt_secret_key>
```

### Database Setup

To seed the database with initial data, run the following command:

```sh
npm run seed
```

### Start the Server

To start the server using PM2, use the following commands:

```sh
pm2 startup
pm2 save
```

## API Endpoints

### User Endpoints

1. Get All Users: GET /api/users
   - Retrieve a list of all users.
2. Get User by Username: GET /api/users/:username
   - Retrieve a user by their username.
3. Create a New User: POST /api/users
   - Create a new user.
4. User Login Authentication: POST /api/login
   - Authenticate a user and provide a JWT.
5. Delete a User: DELETE /api/users/:username
   - Delete a user by their username.
6. Update User by Username: PATCH /api/users/:username
   - Update user information by their username.

### Collection Endpoints

1. Add Collection by User: POST /api/users/:username/collections
   - Add a new plant collection for a user.
2. Get Collections by User: GET /api/users/:username/collections
   - Retrieve all plant collections for a user.
3. Delete Collection: DELETE /api/collections/:collectionId
   - Delete a plant collection by its ID.

## Additional Resources
- [AWS Documentation](https://aws.amazon.com/documentation-overview/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PM2 Documentation](https://pm2.io/docs/runtime/overview/)
