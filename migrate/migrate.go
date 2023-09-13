package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
)

type Data struct {
	SRLegacyFoods []struct {
		Description   string `json:"description"`
		FoodNutrients []struct {
			Nutrient struct {
				ID int `json:"id"`
			} `json:"nutrient"`
			Amount float64 `json:"amount"`
		} `json:"foodNutrients"`
		FdcID int `json:"fdcId"`
	} `json:"SRLegacyFoods"`
}

func main() {
	b, err := os.ReadFile("migrate/FoodData_Central_sr_legacy_food_json_2021-10-28.json")
	if err != nil {
		panic(err)
	}

	var data Data
	err = json.Unmarshal(b, &data)
	if err != nil {
		panic(err)
	}

	f, err := os.Create("fooddata.csv")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	w := csv.NewWriter(f)

	for _, food := range data.SRLegacyFoods {
		col1 := strconv.Itoa(food.FdcID)
		col2 := food.Description
		col3 := func() string {
			for _, n := range food.FoodNutrients {
				if n.Nutrient.ID == 1003 { // protein
					return fmt.Sprintf("%v", n.Amount)
				}
			}
			return "0"
		}()
		col4 := func() string {
			for _, n := range food.FoodNutrients {
				if n.Nutrient.ID == 1004 { // fat
					return fmt.Sprintf("%v", n.Amount)
				}
			}
			return "0"
		}()
		col5 := func() string {
			for _, n := range food.FoodNutrients {
				if n.Nutrient.ID == 1005 { // carbs
					return fmt.Sprintf("%v", n.Amount)
				}
			}
			return "0"
		}()
		col6 := func() string {
			for _, n := range food.FoodNutrients {
				if n.Nutrient.ID == 1008 { // calories
					return fmt.Sprintf("%v", n.Amount)
				}
			}
			return "0"
		}()
		w.Write([]string{col1, col2, col3, col4, col5, col6})
	}

	w.Flush()
}
