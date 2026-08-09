package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/saepudinasep/blog-go-react/server/database"
	"github.com/saepudinasep/blog-go-react/server/router"
)

func init() {
	database.ConnectDB()
}

func main() {
	sqlDB, err := database.DBConn.DB()

	if err != nil {
		panic("Failed to get database connection!")
	}

	defer sqlDB.Close()

	app := fiber.New()

	app.Use(logger.New())

	app.Get("/", func(c *fiber.Ctx) error {

		return c.JSON(fiber.Map{"Message": "Welcome to my fisrt Web Application"})

	})

	router.SetupRoutes(app)

	app.Listen(":8081")
}
