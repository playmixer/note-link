package api

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"smartnote/internal/logger"
	"smartnote/internal/models"
	"strings"
)

func Test(ctx *fiber.Ctx) error {
	return ctx.JSON(struct {
		Status bool `json:"status"`
	}{
		Status: true,
	})
}

// GetFavorites список заметок
func GetFavorites(ctx *fiber.Ctx) error {
	_tags := ctx.Query("tags")
	tags := strings.Split(_tags, ";")
	res, err := models.Favorite{}.GetAll(tags)
	if err != nil {
		logger.Error(err)
		return err
	}
	return ctx.JSON(*res)
}

// GetFavorite получить заметку
func GetFavorite(ctx *fiber.Ctx) error {
	var payload struct {
		ID int `params:"id"`
	}
	err := ctx.ParamsParser(&payload)
	if err != nil {
		logger.Error(err)
		ctx.SendStatus(400)
		return ctx.JSON(responseError(err))
	}

	favorite, err := models.Favorite{}.Get(payload.ID)
	if err != nil {
		logger.Error(err)
		ctx.SendStatus(400)
		return ctx.JSON(responseError(err))
	}

	return ctx.JSON(favorite)

}

// NewFavorite добавляем заметку
func NewFavorite(ctx *fiber.Ctx) error {
	payload := struct {
		Name string   `json:"name"`
		Tags []string `json:"tags"`
		Text string   `json:"text"`
		Url  string   `json:"url"`
	}{}
	err := ctx.BodyParser(&payload)
	if err != nil {
		logger.Error(err)
		return ctx.JSON(responseError(err))
	}
	var tags []*models.Tag

	for _, t := range payload.Tags {
		tag, err := models.Tag{}.Get(t)
		if err != nil {
			logger.Error(err)
			return ctx.JSON(responseError(err))
		}
		tags = append(tags, &tag)
	}

	_, err = models.Favorite{}.New(payload.Name, tags, payload.Text, payload.Url)
	if err != nil {
		logger.Error(err)
		return ctx.JSON(unsuccess())
	}
	return ctx.JSON(success())
}

// DeleteFavorite удаляем заметку
func DeleteFavorite(ctx *fiber.Ctx) error {
	var payload struct {
		ID int `params:"id"`
	}
	err := ctx.ParamsParser(&payload)
	if err != nil {
		logger.Error(err)
		ctx.SendStatus(400)
		return ctx.JSON(responseError(err))
	}
	ok, err := models.Favorite{}.Remove(payload.ID)
	if err != nil {
		logger.Error(err)
		return ctx.JSON(responseError(err))
	}
	if !ok {
		return ctx.JSON(unsuccess())
	}
	return ctx.JSON(success())
}

// EditFavorite изменить заметку
func EditFavorite(ctx *fiber.Ctx) error {
	return ctx.JSON(struct {
		Status bool `json:"status"`
	}{
		Status: true,
	})
}

// GetTags получаем теги
func GetTags(ctx *fiber.Ctx) error {
	tags, err := models.Tag{}.All()
	if err != nil {
		logger.Error(err)
		return ctx.JSON(responseError(err))
	}

	return ctx.JSON(tags)
}

// NewTag добавляем новый тег
func NewTag(ctx *fiber.Ctx) error {
	var tag struct {
		Name string `json:"name"`
	}
	err := ctx.BodyParser(&tag)
	if err != nil {
		logger.Error(err)
		return ctx.JSON(responseError(err))
	}
	if tag.Name == "" {
		return ctx.JSON(responseError(fmt.Errorf("Tag is empty")))
	}
	data, err := models.Tag{}.New(tag.Name)
	if err != nil {
		logger.Error(err)
		ctx.SendStatus(http.StatusBadRequest)
		return ctx.JSON(responseError(err))
	}

	return ctx.JSON(data)
}

// DeleteTag удаляем тег
func DeleteTag(ctx *fiber.Ctx) error {
	var payload struct {
		ID int `params:"id"`
	}
	err := ctx.ParamsParser(&payload)
	if err != nil {
		logger.Error(err)
		return ctx.JSON(responseError(err))
	}
	_, err = models.Tag{}.Remove(payload.ID)
	if err != nil {
		logger.Error(err)
		return ctx.JSON(responseError(err))
	}

	return ctx.JSON(success())
}

// UpdateTags добавляем тег для заметки
func UpdateTags(ctx *fiber.Ctx) error {
	var payload struct {
		ID int `params:"id"`
	}
	err := ctx.ParamsParser(&payload)
	if err != nil {
		logger.Error(err)
		ctx.SendStatus(400)
		return ctx.JSON(responseError(err))
	}
	var payloadTags struct {
		Tags []string `json:"tags"`
	}
	err = ctx.BodyParser(&payloadTags)
	if err != nil {
		logger.Error(err)
		ctx.SendStatus(400)
		return ctx.JSON(responseError(err))
	}
	favorite, err := models.Favorite{}.EditTags(payload.ID, payloadTags.Tags)
	if err != nil {
		logger.Error(err)
		ctx.JSON(responseError(err))
		return err
	}
	return ctx.JSON(favorite)
}

func UpdateUrl(ctx *fiber.Ctx) error {
	var payload struct {
		ID int `params:"id"`
	}
	err := ctx.ParamsParser(&payload)
	if err != nil {
		logger.Error(err)
		ctx.SendStatus(400)
		return ctx.JSON(responseError(err))
	}
	var urlPayload struct {
		Url string `json:"url"`
	}
	err = ctx.BodyParser(&urlPayload)
	if err != nil {
		logger.Error(err)
		ctx.SendStatus(400)
		return ctx.JSON(responseError(err))
	}

	favorite, err := models.Favorite{}.EditUrl(payload.ID, urlPayload.Url)
	if err != nil {
		logger.Error(err)
		return ctx.JSON(responseError(err))
	}

	return ctx.JSON(favorite)
}

func UpdateFavorite(ctx *fiber.Ctx) error {
	var payload struct {
		ID int `params:"id"`
	}
	err := ctx.ParamsParser(&payload)
	if err != nil {
		logger.Error(err)
		ctx.SendStatus(400)
		return ctx.JSON(responseError(err))
	}
	var payloadFavorite = models.Favorite{ID: int64(payload.ID)}
	err = ctx.BodyParser(&payloadFavorite)
	if err != nil {
		logger.Error(err)
		ctx.SendStatus(400)
		return ctx.JSON(responseError(err))
	}

	favorite, err := models.Favorite{}.Update(payloadFavorite)
	if err != nil {
		logger.Error(err)
		return ctx.JSON(responseError(err))
	}

	return ctx.JSON(favorite)
}
