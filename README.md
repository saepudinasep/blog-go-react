# Blog Go React

Full-stack blog application built with **Go Fiber** as the backend API
and **React** as the frontend. The application uses **MySQL** for data
storage and supports article image upload, preview, update, and
deletion.

The project can be run locally or with **Docker Compose**.

## Features

- Create blog articles
- View blog article list
- View article detail
- Update articles
- Delete articles
- Upload article images
- Image preview before submitting
- Replace existing article images
- Automatically delete the old image when it is replaced
- Delete article image when the article is deleted
- Persistent MySQL database with Docker volume
- Persistent uploaded images
- React Router navigation
- React Hook Form validation
- Axios API communication
- SweetAlert confirmation and notifications
- Loading state while processing requests
- Dockerized backend, frontend, and MySQL

## Tech Stack

### Backend

- Go
- Fiber v2
- GORM
- MySQL
- godotenv

### Frontend

- React
- React Bootstrap
- React Bootstrap Icons
- React Router DOM
- React Hook Form
- Axios
- SweetAlert2

### Infrastructure

- Docker
- Docker Compose
- MySQL 8
- Nginx

## Project Structure

```text
blog-go-react/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   ├── package.json
│   └── package-lock.json
│
├── server/
│   ├── controller/
│   │   └── blog.go
│   ├── database/
│   │   └── database.go
│   ├── model/
│   │   └── blog.go
│   ├── router/
│   │   └── router.go
│   ├── uploads/
│   │   └── blogs/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── go.mod
│   ├── go.sum
│   └── server.go
│
├── docker-compose.yml
└── README.md
```

## Blog Model

The blog contains the following main fields:

```go
type Blog struct {
    ID    uint   `gorm:"primaryKey" json:"id"`
    Title string `json:"title" gorm:"not null;column:title;size:255"`
    Post  string `json:"post" gorm:"not null;column:post;size:255"`
    Image string `json:"image" gorm:"column:image;size:255"`
}
```

GORM `AutoMigrate` is used to synchronize the `Blog` table with the
model.

## API

The backend API is available under:

```text
http://localhost:8081/api
```

### Blog Endpoints

Method Endpoint Description

---

GET `/api/blogs` Get all blogs
GET `/api/blogs/:id` Get a blog by ID
POST `/api/blogs` Create a blog
PUT `/api/blogs/:id` Update a blog
DELETE `/api/blogs/:id` Delete a blog

### Image Upload

Create and update requests use:

```text
multipart/form-data
```

The main fields are:

```text
title
post
image
```

Supported image types:

```text
JPG / JPEG
PNG
WebP
```

Maximum image size:

```text
2 MB
```

Uploaded images are stored in:

```text
server/uploads/blogs/
```

## Environment Variables

Create `server/.env` for local development.

Example:

```env
db_user=root
db_password=
db_host=127.0.0.1
db_port=3306
db_name=blog
```

For Docker Compose, the backend receives database configuration from
`docker-compose.yml`.

Example:

```yaml
environment:
  db_user: bloguser
  db_password: blogpassword
  db_host: mysql
  db_port: 3306
  db_name: blog
```

The React application uses:

```env
REACT_APP_API_ROOT=http://localhost:8081/api/
```

When using Docker Compose, this value is passed as a build argument.

## Running Without Docker

### 1. Start MySQL

You can use MySQL from XAMPP or another local MySQL installation.

Make sure MySQL is running on:

```text
127.0.0.1:3306
```

Create the database:

```sql
CREATE DATABASE blog;
```

### 2. Run the Go Backend

Open a terminal:

```powershell
cd server
```

Install dependencies:

```powershell
go mod download
```

Run the server:

```powershell
go run server.go
```

The backend will run on:

```text
http://localhost:8081
```

### 3. Run the React Client

Open another terminal:

```powershell
cd client
```

Install dependencies:

```powershell
npm install
```

Create a `.env` file inside `client`:

```env
REACT_APP_API_ROOT=http://localhost:8081/api/
```

Start React:

```powershell
npm start
```

The frontend will be available at:

```text
http://localhost:3000
```

## Running With Docker Compose

Docker Compose is the recommended way to run the complete application.

The Compose setup contains three services:

```text
React
  │
  ▼
Go Fiber
  │
  ▼
MySQL
```

### Start the Application

From the project root:

```powershell
docker compose up -d --build
```

Check running containers:

```powershell
docker ps
```

You should see:

```text
blog-react-client
blog-go-server
blog-mysql
```

### Application URLs

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8081
```

API:

```text
http://localhost:8081/api
```

MySQL:

```text
localhost:3306
```

### Stop the Application

To stop the containers without removing them:

```powershell
docker compose stop
```

Start them again:

```powershell
docker compose start
```

This is useful when you temporarily want to stop Docker and later
continue the project.

### Stop and Remove Containers

```powershell
docker compose down
```

This removes the containers and Compose network, but the MySQL volume
remains.

> Avoid `docker compose down -v` unless you intentionally want to remove
> the database volume.

## Docker Persistence

### MySQL

The MySQL data is stored in the Docker volume:

```text
mysql_data
```

This means stopping or recreating the MySQL container does not
automatically remove the database.

### Blog Images

Uploaded images are mapped from:

```text
server/uploads/blogs/
```

to:

```text
/app/uploads/blogs
```

inside the backend container.

Therefore, uploaded images remain available when the backend container
is recreated.

## Docker Compose Architecture

```text
                         Docker Compose
┌──────────────────────────────────────────────────────┐
│                                                      │
│   ┌─────────────────┐                                │
│   │ React + Nginx   │                                │
│   │                 │                                │
│   │ localhost:3000  │                                │
│   └────────┬────────┘                                │
│            │                                         │
│            │ HTTP                                    │
│            ▼                                         │
│   ┌─────────────────┐                                │
│   │ Go Fiber API    │                                │
│   │                 │                                │
│   │ localhost:8081  │                                │
│   └────────┬────────┘                                │
│            │                                         │
│            │ MySQL network                           │
│            ▼                                         │
│   ┌─────────────────┐                                │
│   │ MySQL 8         │                                │
│   │                 │                                │
│   │ localhost:3306  │                                │
│   └─────────────────┘                                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Important Docker Notes

The backend connects to MySQL using the Docker service name:

```env
db_host=mysql
db_port=3306
```

Do not use:

```env
db_host=127.0.0.1
```

for the backend when it is running inside Docker.

Inside a container, `127.0.0.1` refers to the container itself, not the
MySQL container.

The React application runs in the user's browser, so its API URL should
point to the host:

```env
REACT_APP_API_ROOT=http://localhost:8081/api/
```

Do not use:

```text
http://backend:8081/api/
```

for the React browser application because `backend` is a Docker-internal
hostname.

## Useful Docker Commands

Show running containers:

```powershell
docker ps
```

Show all containers:

```powershell
docker ps -a
```

Show backend logs:

```powershell
docker logs blog-go-server
```

Show MySQL logs:

```powershell
docker logs blog-mysql
```

Show frontend logs:

```powershell
docker logs blog-react-client
```

Rebuild everything:

```powershell
docker compose up -d --build
```

Rebuild only frontend:

```powershell
docker compose up -d --build frontend
```

Rebuild only backend:

```powershell
docker compose up -d --build backend
```

Stop Compose services:

```powershell
docker compose stop
```

Start stopped services:

```powershell
docker compose start
```

Stop and remove containers:

```powershell
docker compose down
```

## Development Notes

When changing React code during local development, use:

```powershell
cd client
npm start
```

When changing the production Docker frontend configuration or
`REACT_APP_API_ROOT`, rebuild the frontend:

```powershell
docker compose up -d --build frontend
```

React environment variables beginning with `REACT_APP_` are embedded
into the frontend during the build process.

## Git Ignore

Do not commit sensitive environment files.

Recommended entries:

```gitignore
.env
.env.local
node_modules/
build/
server/uploads/blogs/*
```

If you want to keep the upload directory itself in Git, you can add a
`.gitkeep` file:

```text
server/uploads/blogs/.gitkeep
```

and use:

```gitignore
server/uploads/blogs/*
!server/uploads/blogs/.gitkeep
```

## License

This project is intended for learning, portfolio, and development
purposes.
