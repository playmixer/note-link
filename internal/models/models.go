package models

import (
	"fmt"
	"log"
	"smartnote/internal/logger"
	"time"

	"gorm.io/gorm"
)

var (
	db *gorm.DB
)

const (
	TABLE_FAVORITE_TAG = "_favorite_tag"
)

func Init(dbase *gorm.DB) {
	db = dbase
}

type Tag struct {
	ID        int64      `gorm:"primaryKey" json:"id"`
	Name      string     `gorm:"not null;index:,unique" json:"name"`
	Favorites []Favorite `gorm:"many2many:_favorite_tag" json:"-"`
}

func (m Tag) All() ([]Tag, error) {
	var tags = []Tag{}
	result := db.Order("name").Find(&tags)
	if result.Error != nil {
		return nil, result.Error
	}

	return tags, nil
}

func GetTagByName(name string) (Tag, error) {
	tag := Tag{}
	result := db.Where("name = ?", name).Find(&tag)
	if result.Error != nil {
		return tag, result.Error
	}
	if tag.ID == 0 {
		return tag, fmt.Errorf("Not found")
	}
	return tag, nil
}

func (m Tag) Select(v interface{}) []*Tag {
	var tags []*Tag
	db.Model(v).Find(&tags)
	return tags
}

func (m Tag) New(name string) (Tag, error) {
	tag := Tag{Name: name}
	result := db.Create(&tag)
	if result.Error != nil {
		return tag, result.Error
	}

	return tag, nil
}

func (m Tag) Remove(id int) (bool, error) {
	tag := Tag{ID: int64(id)}
	err := db.Find(&tag).Error
	if err != nil {
		logger.Error(err)
		return false, err
	}
	err = db.Delete(tag).Error
	if err != nil {
		logger.Error(err)
		return false, err
	}

	return true, nil
}

type Favorite struct {
	ID        int64     `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"index" json:"name"`
	Text      string    `json:"text"`
	Url       string    `json:"url"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Tags      []Tag     `gorm:"many2many:_favorite_tag" json:"tags"`
}

func (m Favorite) Get(id int) (Favorite, error) {
	var favorite = Favorite{
		Tags: []Tag{},
	}
	err := db.Model(Favorite{}).Preload("Tags").Find(&favorite, id).Error
	return favorite, err
}

func (m Favorite) GetAll(tags []string) (*[]Favorite, error) {
	var favorites []Favorite
	res := db.Debug().Model(Favorite{}).Preload("Tags")
	// if len(tags) > 0 && tags[0] != "" {
	// 	res = res.Joins("join _favorite_tag ON _favorite_tag.favorite_id = favorites.id")
	// 	res = res.Joins("join tags ON tags.id = _favorite_tag.tag_id")
	// 	res = res.Where("tags.name in ?", tags)
	// }

	res.Order("id desc").Find(&favorites)

	var result []Favorite
	if len(tags) > 0 && tags[0] != "" {
		for _, _tag := range tags {
			for _, favorite := range favorites {
				isFiltered := false
				for _, t := range favorite.Tags {
					if t.Name == _tag {
						isFiltered = true
					}
				}
				if isFiltered {
					result = append(result, favorite)
				}
			}
		}
	} else {
		result = favorites
	}

	return &result, nil
}

func (m Favorite) New(name string, tags []Tag, text string, url string) (Favorite, error) {
	favorite := Favorite{
		Name: name,
		Tags: tags,
		Text: text,
		Url:  url,
	}

	result := db.Create(&favorite)

	if result.Error != nil {
		log.Fatalln(result.Error)
		return favorite, result.Error
	}

	return favorite, nil
}

func (m Favorite) EditTags(id int, tags []string) (Favorite, error) {
	favorite, err := m.Get(id)
	if err != nil {
		logger.Error(err)
		return favorite, nil
	}

	err = db.Debug().Exec(fmt.Sprintf("delete from %s where favorite_id = %v", TABLE_FAVORITE_TAG, favorite.ID)).Error
	if err != nil {
		return favorite, err
	}

	_tags := []Tag{}
	for _, t := range tags {
		tag, err := GetTagByName(t)
		if err != nil {
			return favorite, err
		}
		_tags = append(_tags, tag)
	}
	favorite.Tags = _tags
	err = db.Debug().Save(&favorite).Error
	if err != nil {
		return favorite, err
	}

	return favorite, nil
}

func (m Favorite) Remove(id int) (bool, error) {
	favorite := Favorite{ID: int64(id)}
	err := db.Delete(&favorite).Error
	if err != nil {
		logger.Error(err)
		return false, err
	}

	return true, nil
}

func (m Favorite) EditUrl(id int, url string) (Favorite, error) {
	favorite := Favorite{ID: int64(id)}
	err := db.Model(&favorite).Update("url", url).Error
	if err != nil {
		logger.Error(err)
		return favorite, err
	}
	return favorite, nil
}

func (m Favorite) Update(favorite Favorite) (Favorite, error) {
	res := Favorite{ID: favorite.ID}
	err := db.Model(&res).Updates(map[string]interface{}{"name": favorite.Name, "url": favorite.Url, "text": favorite.Text}).Error
	if err != nil {
		logger.Error(err)
		return favorite, err
	}
	return res, nil
}
