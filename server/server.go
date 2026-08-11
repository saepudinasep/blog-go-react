package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/saepudinasep/blog-go-react/server/database"
	"github.com/saepudinasep/blog-go-react/server/router"

	"github.com/gofiber/fiber/v2/middleware/cors"
)

func init() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Error loading .env file")
	}
	database.ConnectDB()
}

func main() {
	sqlDB, err := database.DBConn.DB()

	if err != nil {
		panic("Failed to get database connection!")
	}

	defer sqlDB.Close()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("/", func(c *fiber.Ctx) error {

		return c.JSON(fiber.Map{"Message": "Welcome to my fisrt Web Application"})

	})

	router.SetupRoutes(app)

	app.Listen(":8081")
}
