package main

import (
	"encoding/csv"
	"html/template"
	"io"
	"net/http"
	"os"
	"strconv"
)

type ingredient struct {
	ID                 string
	Description        string
	DailyProtein       string
	DailyFat           string
	DailyCarb          string
	DailyCal           string
	DailyCost          string
	DailyConsumption   string
	WeeklyConsumption  string
	MonthlyConsumption string
}

var ingredients []ingredient

const SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT = 100

func main() {
	http.HandleFunc("/", base)
	http.HandleFunc("/container", container)
	http.HandleFunc("/foods", foods)
	http.ListenAndServe(":8080", nil)
}

func base(w http.ResponseWriter, r *http.Request) {
	b, err := os.ReadFile("base.html")
	if err != nil {
		panic(err)
	}
	w.Write(b)
}

func container(w http.ResponseWriter, r *http.Request) {
	form(w)
	table(w)
}

func foods(w http.ResponseWriter, r *http.Request) {
	fdcID := r.PostFormValue("ingredient")
	consumptionType := r.PostFormValue("consumptionType")
	consumptionAmount := r.PostFormValue("consumptionAmount")

	dailyConsumption := func() int {
		if consumptionType == "daily" {
			i, _ := strconv.Atoi(consumptionAmount)
			return i
		}

		if consumptionType == "weekly" {
			i, _ := strconv.Atoi(consumptionAmount)
			return i / 7
		}

		if consumptionType == "monthly" {
			i, _ := strconv.Atoi(consumptionAmount)
			return i / 30
		}

		return 0
	}()

	f, err := os.Open("fooddata.csv")
	if err != nil {
		panic(err)
	}

	reader := csv.NewReader(f)

	food := make([]string, 6) // 6 columns in the csv

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			panic(err)
		}

		if record[0] == fdcID {
			copy(food, record)
			break
		}
	}
	f.Close()

	id := food[0]
	desc := food[1]
	dProt := calculateDailyIntake(food[2], dailyConsumption)
	dFat := calculateDailyIntake(food[3], dailyConsumption)
	dCarb := calculateDailyIntake(food[4], dailyConsumption)
	dCal := calculateDailyIntake(food[5], dailyConsumption)
	dCost := calculateDailyIntake("0.00", dailyConsumption)
	dCon := strconv.Itoa(dailyConsumption)
	wCon := strconv.Itoa(dailyConsumption * 7)
	mCon := strconv.Itoa(dailyConsumption * 30)

	ingredients = append(ingredients, ingredient{
		ID:                 id,
		Description:        desc,
		DailyProtein:       dProt,
		DailyFat:           dFat,
		DailyCarb:          dCarb,
		DailyCal:           dCal,
		DailyCost:          dCost,
		DailyConsumption:   dCon,
		WeeklyConsumption:  wCon,
		MonthlyConsumption: mCon,
	})

	tProt, tFat, tCarb, tCal, tCost := calculateTotalNutrient(ingredients)

	row(w, map[string]string{
		"ID":                 id,
		"Description":        desc,
		"DailyProtein":       dProt,
		"DailyFat":           dFat,
		"DailyCarb":          dCarb,
		"DailyCal":           dCal,
		"DailyCost":          dCost,
		"DailyConsumption":   dCon,
		"WeeklyConsumption":  wCon,
		"MonthlyConsumption": mCon,
		"TotalProtein":       tProt,
		"TotalFat":           tFat,
		"TotalCarbs":         tCarb,
		"TotalCalories":      tCal,
		"TotalCost":          tCost,
	})
}

func calculateDailyIntake(nutrientAmount string, dailyConsumption int) string {
	i, _ := strconv.ParseFloat(nutrientAmount, 64)
	j := i * float64(dailyConsumption) / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT
	return strconv.FormatFloat(j, 'f', 2, 64)
}

func calculateTotalNutrient(ingredients []ingredient) (tProt, tFat, tCarb, tCal, tCost string) {
	totalProtein := float64(0)
	totalFat := float64(0)
	totalCarb := float64(0)
	totalCal := float64(0)
	totalCost := float64(0)

	for _, ing := range ingredients {
		i, _ := strconv.ParseFloat(ing.DailyProtein, 64)
		j, _ := strconv.ParseFloat(ing.DailyFat, 64)
		k, _ := strconv.ParseFloat(ing.DailyCarb, 64)
		l, _ := strconv.ParseFloat(ing.DailyCal, 64)

		totalProtein = totalProtein + i
		totalFat = totalFat + j
		totalCarb = totalCarb + k
		totalCal = totalCal + l
	}

	tProt = strconv.FormatFloat(totalProtein, 'f', 2, 64)
	tFat = strconv.FormatFloat(totalFat, 'f', 2, 64)
	tCarb = strconv.FormatFloat(totalCarb, 'f', 2, 64)
	tCal = strconv.FormatFloat(totalCal, 'f', 2, 64)
	tCost = strconv.FormatFloat(totalCost, 'f', 2, 64)

	return
}

func form(w http.ResponseWriter) {
	b, err := os.ReadFile("form.html")
	if err != nil {
		panic(err)
	}

	t := template.New("form")
	t, err = t.Parse(string(b))
	if err != nil {
		panic(err)
	}

	f, err := os.Open("fooddata.csv")
	if err != nil {
		panic(err)
	}

	reader := csv.NewReader(f)

	type foo struct {
		FdcID       string
		Description string
	}
	foos := []foo{}

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			panic(err)
		}

		foos = append(foos, foo{FdcID: record[0], Description: record[1]})
	}
	f.Close()

	err = t.Execute(w, foos)
	if err != nil {
		panic(err)
	}
}

func table(w http.ResponseWriter) {
	b, err := os.ReadFile("table.html")
	if err != nil {
		panic(err)
	}

	t := template.New("table")
	t, err = t.Parse(string(b))
	if err != nil {
		panic(err)
	}

	err = t.Execute(w, ingredients)
	if err != nil {
		panic(err)
	}
}

func row(w http.ResponseWriter, m map[string]string) {
	b, err := os.ReadFile("row.html")
	if err != nil {
		panic(err)
	}

	t := template.New("row")
	t, err = t.Parse(string(b))
	if err != nil {
		panic(err)
	}

	err = t.Execute(w, m)
	if err != nil {
		panic(err)
	}
}
