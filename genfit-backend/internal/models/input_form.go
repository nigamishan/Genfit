package models

type ClientInputData struct {
	ClientData        ClientData        `json:"clientData"`
	ClientResources   ClientResources   `json:"clientResources"`
	ClientGoals       ClientGoals       `json:"clientGoals"`
	ClientFitnessData ClientFitnessData `json:"clientFitnessData"`
}

type ClientData struct {
	Weight   string `json:"weight"`
	Height   string `json:"height"`
	Age      string `json:"age"`
	Gender   string `json:"gender"`
	BodyType string `json:"bodyType"`
}

type ClientFitnessData struct {
	GymExperience string `json:"gymExperience"`
	BodyFat       string `json:"bodyFat"`
	DeadliftPR    string `json:"deadliftPR"`
	BenchPressPR  string `json:"benchPressPR"`
	SquatPR       string `json:"squatPR"`
}

type ClientGoals struct {
	TargetBodyFat    string `json:"targetBodyFat"`
	TargetWeight     string `json:"targetWeight"`
	TargetDeadlift   string `json:"targetDeadlift"`
	TargetSquat      string `json:"targetSquat"`
	TargetBenchPress string `json:"targetBenchPress"`
}

type ClientResources struct {
	GymDays         string   `json:"gymDays"`
	SessionDuration string   `json:"sessionDuration"`
	Equipment       []string `json:"equipment"`
}
