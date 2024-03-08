package middleware

import (
	"github.com/charmbracelet/log"
	"github.com/labstack/echo/v4"
)

func Logger() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			req := c.Request()
			res := c.Response()
			if err := next(c); err != nil {
				c.Error(err)
			}

			// get request path
			p := req.URL.Path
			if p == "" {
				p = "/"
			}
			// get response status
			s := res.Status
			// get request ip addr
			ip := c.RealIP()
			// get user agent
			agent := req.UserAgent()
			// get request size
			reqSize := req.Header.Get(echo.HeaderContentLength)
			// get response size
			resSize := res.Size

			log.Info("New Request", "path", p, "status", s, "ip", ip, "user_agent", agent, "req_size", reqSize, "res_size", resSize)

			return nil
		}
	}
}
