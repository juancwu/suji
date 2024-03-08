package db

import (
	"database/sql"
	"os"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

type Connection struct {
	DB *sql.DB
}

func NewConnection() (*Connection, error) {
	url := os.Getenv("DB_URL")

	db, err := sql.Open("libsql", url)
	if err != nil {
		return nil, err
	}

	c := &Connection{
		DB: db,
	}

	return c, nil
}
