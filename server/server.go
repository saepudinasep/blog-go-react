package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/saepudinasep/blog-go-react/database"
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

	app.Get("/", func(c *fiber.Ctx) error {

		return c.JSON(fiber.Map{"Message": "Welcome to my fisrt Web Application"})

	})

	app.Listen(":8081")
}
