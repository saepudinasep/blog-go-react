package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/saepudinasep/blog-go-react/server/controller"
)

// SetupRoutes sets up the routes for the application
func SetupRoutes(app *fiber.App) {
	// list => GET
	// create => POST
	// update => PUT
	// delete => DELETE

	app.Get("/api/blogs", controller.BlogList)
	app.Post("/api/blogs", controller.BlogCreate)
	app.Put("/api/blogs/:id", controller.BlogUpdate)
	app.Delete("/api/blogs/:id", controller.BlogDelete)
}