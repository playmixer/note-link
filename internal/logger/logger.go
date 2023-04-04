package logger

import "fmt"

type errorMessage interface {
	Error() string
}

func Error(e errorMessage) {
	fmt.Println(e.Error())
}
