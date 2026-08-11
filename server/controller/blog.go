package controller

import (
	"errors"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/saepudinasep/blog-go-react/server/database"
	"github.com/saepudinasep/blog-go-react/server/model"
	"gorm.io/gorm"
)

// Get all Blogs from Database
func BlogList(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "OK",
		"msg":        "Blog List",
	}

	db := database.DBConn

	var records []model.Blog
	result := db.Find(&records)

	if result.Error != nil {
		log.Println("Error getting blog records:", result.Error)

		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to get blog records"

		c.Status(503)
		return c.JSON(context)
	}

	context["blog_records"] = records

	c.Status(200)
	return c.JSON(context)
}

// Get Blog Detail from Database
func BlogDetail(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "OK",
		"msg":        "Blog Detail",
	}

	id := c.Params("id")

	var record model.Blog

	// Cari blog berdasarkan ID
	result := database.DBConn.First(&record, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			context["statusText"] = "Not Found"
			context["msg"] = "Blog record not found"

			c.Status(404)
			return c.JSON(context)
		}

		log.Println("Error getting blog detail:", result.Error)

		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to get blog detail"

		c.Status(503)
		return c.JSON(context)
	}

	context["data"] = record

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

		c.Status(400)
		return c.JSON(context)
	}

	result := database.DBConn.Create(record)

	if result.Error != nil {
		log.Println("Error creating blog record:", result.Error)

		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to create blog record"

		c.Status(503)
		return c.JSON(context)
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

	id := c.Params("id")

	var record model.Blog

	// Cari blog berdasarkan ID
	result := database.DBConn.First(&record, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			context["statusText"] = "Not Found"
			context["msg"] = "Blog record not found"

			c.Status(404)
			return c.JSON(context)
		}

		log.Println("Error getting blog record:", result.Error)

		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to get blog record"

		c.Status(503)
		return c.JSON(context)
	}

	// Parse request body
	if err := c.BodyParser(&record); err != nil {
		log.Println("Error parsing request body:", err)

		context["statusText"] = "Bad Request"
		context["msg"] = "Invalid request body"

		c.Status(400)
		return c.JSON(context)
	}

	// Update database
	result = database.DBConn.Save(&record)

	if result.Error != nil {
		log.Println("Error updating blog record:", result.Error)

		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to update blog record"

		c.Status(503)
		return c.JSON(context)
	}

	context["msg"] = "Blog record updated successfully"
	context["data"] = record

	c.Status(200)
	return c.JSON(context)
}

// Delete a Blog from Database
func BlogDelete(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "OK",
		"msg":        "Delete Blog for the given ID",
	}

	id := c.Params("id")

	var record model.Blog

	// Cari blog berdasarkan ID
	result := database.DBConn.First(&record, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			context["statusText"] = "Not Found"
			context["msg"] = "Blog record not found"

			c.Status(404)
			return c.JSON(context)
		}

		log.Println("Error getting blog record:", result.Error)

		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to get blog record"

		c.Status(503)
		return c.JSON(context)
	}

	// Hapus blog
	result = database.DBConn.Delete(&record)

	if result.Error != nil {
		log.Println("Error deleting blog record:", result.Error)

		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to delete blog record"

		c.Status(503)
		return c.JSON(context)
	}

	context["msg"] = "Blog record deleted successfully"

	c.Status(200)
	return c.JSON(context)
}
