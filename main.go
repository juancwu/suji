package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/juancwu/suji/db"
	"github.com/juancwu/suji/middleware"
	"github.com/juancwu/suji/views"

	"github.com/charmbracelet/log"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
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

	e := echo.New()

	// attach middlewares
	e.Use(middleware.Logger())

	// serve static files
	e.Static("/public/static", "public/static")

	e.GET("/auth", func(c echo.Context) error {
		return views.AuthPage().Render(context.Background(), c.Response().Writer)
	})

	// health check route
	e.GET("/healthy", func(c echo.Context) error {
		_, err := c.Response().Write([]byte(http.StatusText(http.StatusOK)))
		if err != nil {
			return err
		}
		return nil
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "5173"
	}

	log.Fatal(e.Start(fmt.Sprintf(":%s", port)))
}
