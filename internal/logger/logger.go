package logger

import (
	"fmt"
	"log"
	"os"
	"time"
)

type errorMessage interface {
	Error() string
}

func CreateFile(name string) error {
	fo, err := os.Create(name)
	if err != nil {
		return err
	}
	defer func() {
		fo.Close()
	}()
	return nil
}

func saveLog(message string) error {
	filename := fmt.Sprintf("./logs/log_%s.log", time.Now().Format("2006-01-02"))

	f, err := os.OpenFile(filename, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()

	log.SetOutput(f)
	log.Println(message)

	return nil
}

func Error(e errorMessage) {
	message := fmt.Sprintf("%s ERROR: %s", time.Now().Format("15:04:05"), e.Error())
	saveLog(message)
	fmt.Println(message)
}

func Info(text string) {
	message := fmt.Sprintf("%s INFO: %s", time.Now().Format("15:04:05"), text)
	saveLog(message)
	fmt.Println(message)
}
