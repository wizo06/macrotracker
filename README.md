# Dataset

https://fdc.nal.usda.gov/download-datasets.html

```bash
wget -P https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_json_2018-04.zip
unzip migrate/FoodData_Central_sr_legacy_food_json_2018-04.zip -d migrate
go run migrate/migrate.go
```

# Run

```bash
go run main.go
```

# Licenses

- [Golang: BSD 3-Clause](https://github.com/golang/go/blob/master/LICENSE)
- [HTMX: BSD 2-Clause](https://github.com/bigskysoftware/htmx/blob/master/LICENSE)
- [Pico CSS: MIT](https://github.com/picocss/pico/blob/master/LICENSE.md)
