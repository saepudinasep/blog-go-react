package database

import (
	"log"

	"github.com/saepudinasep/blog-go-react/model"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DBConn *gorm.DB

func ConnectDB() {
	dsn := "root:@tcp(localhost:3306)/fiber_blog?charset=utf8mb4&parseTime=True&loc=Local"

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		panic("Failed to connect to database!")
	}

	log.Println("Database connection established.")

	db.AutoMigrate(new(model.Blog))

	DBConn = db
}
