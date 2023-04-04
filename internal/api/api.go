package api

func unsuccess() interface{} {
	return struct {
		Success bool `json:"success"`
	}{false}
}

func success() interface{} {
	return struct {
		Success bool `json:"success"`
	}{true}
}

func responseError(err error) interface{} {
	return struct {
		Success bool   `json:"success"`
		Error   string `json:"error"`
	}{
		Success: false,
		Error:   err.Error(),
	}
}
