package controller

import "github.com/gofiber/fiber/v2"

// Get all Blogs from Database
func BlogList(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "OK",
		"msg":        "Blog List",
	}
	c.Status(200)
	return c.JSON(context)
}

// Add a Blog into Database
func BlogCreate(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "Created",
		"msg":        "Add Blog",
	}
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
