package main

import (
	"fmt"
	"log"
	"smartnote/internal/api"
	"smartnote/internal/config"
	"smartnote/internal/database"
	"smartnote/internal/logger"
	"smartnote/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/template/html"
)

func init() {
	config.Init()
	conf := config.App
	db := database.Create(database.Config{
		Username: conf.Database.Username,
		Password: conf.Database.Password,
		Host:     conf.Database.Host,
		Port:     conf.Database.Port,
		Name:     conf.Database.Name,
		Type:     conf.Database.Type,
	})
	models.Init(db)

	db.AutoMigrate(&models.Tag{})
	db.AutoMigrate(&models.Favorite{})
}

func main() {
	logger.Info("App starting")
	engine := html.New("./www", ".html")
	app := fiber.New(fiber.Config{
		Views: engine,
	})
	// app.Use(basicauth.New(basicauth.Config{
	// 	Users: map[string]string{
	// 		"mixer": "Jrcbutybev058507!",
	// 	},
	// }))

	subRoute := app.Group(config.App.MainRoute)

	subRoute.Static("/static", "./www/static")

	subRoute.Get("/", func(ctx *fiber.Ctx) error {
		return ctx.Render("index", fiber.Map{})
	})

	apiHandler := subRoute.Group("/api/v0")
	//apiHandler.Use(func(ctx *fiber.Ctx) {
	//	ctx.Accepts("application/json")
	//})
	apiHandler.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	apiHandler.Get("/favorites", api.GetFavorites)
	apiHandler.Post("/favorites", api.NewFavorite)
	apiHandler.Get("/favorite/:id", api.GetFavorite)
	apiHandler.Put("/favorite/:id/tags", api.UpdateTags)
	apiHandler.Put("/favorite/:id/url", api.UpdateUrl)
	apiHandler.Put("/favorite/:id", api.UpdateFavorite)
	apiHandler.Delete("/favorite/:id", api.DeleteFavorite)
	apiHandler.Put("/favorite/:id", api.EditFavorite)
	apiHandler.Get("/tags", api.GetTags)
	apiHandler.Post("/tags", api.NewTag)
	apiHandler.Delete("/tag/:id", api.DeleteTag)

	log.Fatal(app.Listen(fmt.Sprintf(":%v", config.App.Http.Port)))
}
