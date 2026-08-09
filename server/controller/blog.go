package controller

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/saepudinasep/blog-go-react/server/database"
	"github.com/saepudinasep/blog-go-react/server/model"
)

// Get all Blogs from Database
func BlogList(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "OK",
		"msg":        "Blog List",
	}

	db := database.DBConn

	var records []model.Blog
	db.Find(&records)

	context["blog_records"] = records

	c.Status(200)
	return c.JSON(context)
}

// Add a Blog into Database
func BlogCreate(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "Created",
		"msg":        "Add Blog",
	}

	record := new(model.Blog)
	if err := c.BodyParser(record); err != nil {
		log.Println("Error parsing request body:", err)
		context["statusText"] = "Bad Request"
		context["msg"] = "Invalid request body"
	}

	result := database.DBConn.Create(&record)

	if result.Error != nil {
		log.Println("Error creating blog record:", result.Error)
		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to create blog record"
	}

	context["msg"] = "Blog record created successfully"
	context["data"] = record

	c.Status(201)
	return c.JSON(context)
}

// Update a Blog in Database
func BlogUpdate(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "OK",
		"msg":        "Update Blog",
	}
	c.Status(200)
	return c.JSON(context)
}

// Delete a Blog from Database
func BlogDelete(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "OK",
		"msg":        "Delete Blog for the given ID",
	}
	c.Status(200)
	return c.JSON(context)
}
