package database

import (
	"log"
	"os"

	"github.com/saepudinasep/blog-go-react/server/model"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DBConn *gorm.DB

func ConnectDB() {
	user := os.Getenv("db_user")
	password := os.Getenv("db_password")
	host := os.Getenv("db_host")
	port := os.Getenv("db_port")
	dbName := os.Getenv("db_name")

	// Default value untuk development lokal
	if host == "" {
		host = "127.0.0.1"
	}

	if port == "" {
		port = "3306"
	}

	dsn := user + ":" + password +
		"@tcp(" + host + ":" + port + ")/" +
		dbName +
		"?charset=utf8mb4&parseTime=True&loc=Local"

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Error),
	})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connection established.")

	// Auto migrate Blog model
	if err := db.AutoMigrate(&model.Blog{}); err != nil {
		log.Fatal("AutoMigrate failed:", err)
	}

	DBConn = db
}
