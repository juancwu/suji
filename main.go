package main

import (
	"os"

	"github.com/charmbracelet/log"
	"github.com/joho/godotenv"
	"github.com/juancwu/suji/db"
)

func main() {
	if os.Getenv("APP_ENV") != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal(err)
		}
	}

	conn, err := db.NewConnection()
	if err != nil {
		log.Fatal(err)
	}
	defer conn.DB.Close()

	log.Info("Heyyyy this is suji!")
}
