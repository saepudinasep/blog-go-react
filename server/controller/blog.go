package controller

import (
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

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

	// =========================
	// GET FORM DATA
	// =========================

	title := strings.TrimSpace(c.FormValue("title"))
	post := strings.TrimSpace(c.FormValue("post"))

	// =========================
	// VALIDATION
	// =========================

	if title == "" {
		context["statusText"] = "Bad Request"
		context["msg"] = "Title is required"

		return c.Status(fiber.StatusBadRequest).JSON(context)
	}

	if post == "" {
		context["statusText"] = "Bad Request"
		context["msg"] = "Post is required"

		return c.Status(fiber.StatusBadRequest).JSON(context)
	}

	// =========================
	// GET IMAGE
	// =========================

	file, err := c.FormFile("image")

	if err != nil {
		// Image dibuat optional.
		// Jika image wajib, bagian ini bisa diubah menjadi Bad Request.
		if !errors.Is(err, fiber.ErrUnprocessableEntity) {
			log.Println("Error getting image:", err)

			context["statusText"] = "Bad Request"
			context["msg"] = "Invalid image file"

			return c.Status(fiber.StatusBadRequest).JSON(context)
		}
	}

	var imagePath string

	if file != nil {
		// =========================
		// VALIDATE IMAGE
		// =========================

		const maxFileSize = 5 * 1024 * 1024 // 5 MB

		if file.Size > maxFileSize {
			context["statusText"] = "Bad Request"
			context["msg"] = "Image size must not exceed 5 MB"

			return c.Status(fiber.StatusBadRequest).JSON(context)
		}

		extension := strings.ToLower(filepath.Ext(file.Filename))

		allowedExtensions := map[string]bool{
			".jpg":  true,
			".jpeg": true,
			".png":  true,
			".webp": true,
		}

		if !allowedExtensions[extension] {
			context["statusText"] = "Bad Request"
			context["msg"] = "Only JPG, JPEG, PNG, and WEBP images are allowed"

			return c.Status(fiber.StatusBadRequest).JSON(context)
		}

		// =========================
		// CREATE UPLOAD DIRECTORY
		// =========================

		uploadDir := "./uploads/blogs"

		if err := os.MkdirAll(uploadDir, 0755); err != nil {
			log.Println("Error creating upload directory:", err)

			context["statusText"] = "Service Unavailable"
			context["msg"] = "Failed to create upload directory"

			return c.Status(fiber.StatusServiceUnavailable).JSON(context)
		}

		// =========================
		// GENERATE UNIQUE FILE NAME
		// =========================

		fileName := fmt.Sprintf(
			"%d%s",
			time.Now().UnixNano(),
			extension,
		)

		filePath := filepath.Join(uploadDir, fileName)

		// =========================
		// SAVE IMAGE
		// =========================

		if err := saveUploadedFile(file, filePath); err != nil {
			log.Println("Error saving image:", err)

			context["statusText"] = "Service Unavailable"
			context["msg"] = "Failed to save image"

			return c.Status(fiber.StatusServiceUnavailable).JSON(context)
		}

		// Path yang disimpan ke database
		imagePath = "/uploads/blogs/" + fileName
	}

	// =========================
	// CREATE BLOG RECORD
	// =========================

	record := &model.Blog{
		Title: title,
		Post:  post,
		Image: imagePath,
	}

	result := database.DBConn.Create(record)

	if result.Error != nil {
		log.Println("Error creating blog record:", result.Error)

		// Jika database gagal, hapus file yang
		// sudah terlanjur disimpan.
		if imagePath != "" {
			filePath := "." + imagePath

			if err := os.Remove(filePath); err != nil {
				log.Println("Error removing uploaded image:", err)
			}
		}

		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to create blog record"

		return c.Status(fiber.StatusServiceUnavailable).JSON(context)
	}

	// =========================
	// SUCCESS RESPONSE
	// =========================

	context["msg"] = "Blog record created successfully"
	context["data"] = record

	return c.Status(fiber.StatusCreated).JSON(context)
}

func saveUploadedFile(file *multipart.FileHeader, destination string) error {
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	dst, err := os.Create(destination)
	if err != nil {
		return err
	}
	defer dst.Close()

	_, err = io.Copy(dst, src)

	return err
}

// Update a Blog in Database
func BlogUpdate(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "OK",
		"msg":        "Update Blog",
	}

	id := c.Params("id")

	var record model.Blog

	// =========================
	// FIND BLOG
	// =========================

	result := database.DBConn.First(&record, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			context["statusText"] = "Not Found"
			context["msg"] = "Blog record not found"

			return c.Status(fiber.StatusNotFound).JSON(context)
		}

		log.Println("Error getting blog record:", result.Error)

		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to get blog record"

		return c.Status(fiber.StatusServiceUnavailable).JSON(context)
	}

	// =========================
	// GET FORM DATA
	// =========================

	title := strings.TrimSpace(c.FormValue("title"))
	post := strings.TrimSpace(c.FormValue("post"))

	// Validasi title
	if title == "" {
		context["statusText"] = "Bad Request"
		context["msg"] = "Title is required"

		return c.Status(fiber.StatusBadRequest).JSON(context)
	}

	// Validasi post
	if post == "" {
		context["statusText"] = "Bad Request"
		context["msg"] = "Post is required"

		return c.Status(fiber.StatusBadRequest).JSON(context)
	}

	// Update text
	record.Title = title
	record.Post = post

	// =========================
	// IMAGE UPLOAD
	// =========================

	file, err := c.FormFile("image")

	if err == nil && file != nil {
		// Folder upload
		uploadDir := "./uploads/blogs"

		// Pastikan folder tersedia
		if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
			log.Println("Error creating upload directory:", err)

			context["statusText"] = "Internal Server Error"
			context["msg"] = "Failed to create upload directory"

			return c.Status(fiber.StatusInternalServerError).JSON(context)
		}

		// Validasi extension
		extension := strings.ToLower(filepath.Ext(file.Filename))

		allowedExtensions := map[string]bool{
			".jpg":  true,
			".jpeg": true,
			".png":  true,
			".webp": true,
		}

		if !allowedExtensions[extension] {
			context["statusText"] = "Bad Request"
			context["msg"] = "Invalid image format. Allowed formats: jpg, jpeg, png, webp"

			return c.Status(fiber.StatusBadRequest).JSON(context)
		}

		// Generate nama file baru
		fileName := fmt.Sprintf(
			"blog_%d_%d%s",
			record.ID,
			time.Now().UnixNano(),
			extension,
		)

		filePath := filepath.Join(uploadDir, fileName)

		// Simpan gambar baru
		if err := c.SaveFile(file, filePath); err != nil {
			log.Println("Error saving image:", err)

			context["statusText"] = "Internal Server Error"
			context["msg"] = "Failed to save image"

			return c.Status(fiber.StatusInternalServerError).JSON(context)
		}

		// =========================
		// DELETE OLD IMAGE
		// =========================

		if record.Image != "" {
			oldImagePath := filepath.Join(".", record.Image)

			if err := os.Remove(oldImagePath); err != nil && !os.IsNotExist(err) {
				log.Println("Warning: failed to delete old image:", err)
			}
		}

		// Simpan path image ke database
		record.Image = "/" + filepath.ToSlash(filePath)
	}

	// =========================
	// UPDATE DATABASE
	// =========================

	result = database.DBConn.Save(&record)

	if result.Error != nil {
		log.Println("Error updating blog record:", result.Error)

		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to update blog record"

		return c.Status(fiber.StatusServiceUnavailable).JSON(context)
	}

	// =========================
	// RESPONSE
	// =========================

	context["msg"] = "Blog record updated successfully"
	context["data"] = record

	return c.Status(fiber.StatusOK).JSON(context)
}

// Delete a Blog from Database
func BlogDelete(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "OK",
		"msg":        "Delete Blog for the given ID",
	}

	id := c.Params("id")

	var record model.Blog

	// =========================
	// FIND BLOG
	// =========================

	result := database.DBConn.First(&record, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			context["statusText"] = "Not Found"
			context["msg"] = "Blog record not found"

			return c.Status(fiber.StatusNotFound).JSON(context)
		}

		log.Println("Error getting blog record:", result.Error)

		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to get blog record"

		return c.Status(fiber.StatusServiceUnavailable).JSON(context)
	}

	// Simpan path image sebelum record dihapus
	imagePath := record.Image

	// =========================
	// DELETE BLOG FROM DATABASE
	// =========================

	result = database.DBConn.Delete(&record)

	if result.Error != nil {
		log.Println("Error deleting blog record:", result.Error)

		context["statusText"] = "Service Unavailable"
		context["msg"] = "Failed to delete blog record"

		return c.Status(fiber.StatusServiceUnavailable).JSON(context)
	}

	// =========================
	// DELETE IMAGE FILE
	// =========================

	if imagePath != "" {
		// Contoh:
		// /uploads/blogs/blog_1_123456789.png
		//
		// Menjadi:
		// ./uploads/blogs/blog_1_123456789.png

		filePath := "." + imagePath

		if err := os.Remove(filePath); err != nil {
			if os.IsNotExist(err) {
				log.Println("Image file not found:", filePath)
			} else {
				// Database sudah berhasil dihapus,
				// tetapi file gagal dihapus.
				log.Println("Warning: failed to delete image file:", err)
			}
		} else {
			log.Println("Image file deleted:", filePath)
		}
	}

	// =========================
	// RESPONSE
	// =========================

	context["msg"] = "Blog record deleted successfully"

	return c.Status(fiber.StatusOK).JSON(context)
}
