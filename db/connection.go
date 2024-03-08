package db

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

type Connection struct {
	DB *sql.DB
}

func NewConnection() (*Connection, error) {
	token := os.Getenv(os.Getenv("DATABASE_TOKEN"))
	url := fmt.Sprintf(os.Getenv("DATABASE_URL"), token)

	db, err := sql.Open("libsql", url)
	if err != nil {
		return nil, err
	}

	c := &Connection{
		DB: db,
	}

	return c, nil
}
