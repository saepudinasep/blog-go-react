package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	"github.com/saepudinasep/blog-go-react/server/database"
	"github.com/saepudinasep/blog-go-react/server/router"
)

func init() {
	// Load .env untuk development lokal.
	// Di Docker, environment variable akan diberikan oleh container.
	if err := godotenv.Load(".env"); err != nil {
		log.Println(".env file not found, using environment variables")
	}

	database.ConnectDB()
}

func main() {
	sqlDB, err := database.DBConn.DB()
	if err != nil {
		log.Fatal("Failed to get database connection:", err)
	}

	defer sqlDB.Close()

	app := fiber.New()

	// =========================
	// CORS
	// =========================

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// =========================
	// HEALTH CHECK / ROOT
	// =========================

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Welcome to my first Web Application",
		})
	})

	// =========================
	// ROUTES
	// =========================

	router.SetupRoutes(app)

	// =========================
	// SERVER
	// =========================

	log.Println("Server running on http://localhost:8081")

	if err := app.Listen("0.0.0.0:8081"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
