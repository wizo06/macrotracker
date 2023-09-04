const part1 = require('./part1.json');
const part2 = require('./part2.json');
const part3 = require('./part3.json');
const part4 = require('./part4.json');
const data = {SRLegacyFoods:[...part1, ...part2, ...part3, ...part4]}

const SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT = 100
const ingredients = []

Bun.serve({
    port: 3000, 
    async fetch(req) { 
        const url = new URL(req.url);
        if (req.method === "GET" && url.pathname === "/") return new Response(`
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://unpkg.com/htmx.org@1.9.5" integrity="sha384-xcuj3WpfgjlKF+FXhSQFQ0ZNr39ln+hwjN3npfM9VBnUskLolQAcN80McRIVOPuO" crossorigin="anonymous"></script>
            </head>
            <body hx-get="/ingredients" hx-swap="innerHTML" hx-trigger="load" />
        </html>
        `, { headers: { 'Content-Type': 'text/html' }});
        if (req.method === "GET" && url.pathname === "/totalProtein") return new Response(`999`);
        if (req.method === "GET" && url.pathname === "/ingredients") return new Response(`
        <form hx-post="/foods" hx-target="#insertAfterMe" hx-swap="beforeend">
            <select name="ingredient">
            ${data.SRLegacyFoods.map(f => `<option value="${f.fdcId}">${f.fdcId}: ${f.description}</option>`)}
            </select>
            <br /><br />
            <table border="1px solid black">
                <thead>
                    <tr>
                        <th colspan="3">Consumption timeframe</th>
                    </tr>
                </head>
                <tbody>
                    <tr>
                        <td><input type="radio" name="consumptionType" value="daily" checked />Daily</td>
                        <td><input type="radio" name="consumptionType" value="weekly" />Weekly</td>
                        <td><input type="radio" name="consumptionType" value="monthly" />Monthly</td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <label>Consumption amount (g)</label>
                            <input type="text" name="consumptionAmount" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                        <button type="submit">Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
        <br /><br />
        <table border="1px solid black">
            <thead>
                <tr>
                    <th rowspan="2">FDC ID</th>
                    <th rowspan="2">Ingredient</th>
                    <th colspan="5">Daily</th>
                    <th colspan="5">Weekly</th>
                    <th colspan="5">Monthly</th>
                </tr>
                <tr>
                    <th>Protein (g)</th>
                    <th>Fat (g)</th>
                    <th>Carbs (g)</th>
                    <th>Calories (kcal)</th>
                    <th>Consumption (g)</th>
                    <th>Protein (g)</th>
                    <th>Fat (g)</th>
                    <th>Carbs (g)</th>
                    <th>Calories (kcal)</th>
                    <th>Consumption (g)</th>
                    <th>Protein (g)</th>
                    <th>Fat (g)</th>
                    <th>Carbs (g)</th>
                    <th>Calories (kcal)</th>
                    <th>Consumption (g)</th>
                </tr>
            </thead>
            <tbody id="insertAfterMe">
                <tr>
                    <td colspan="2">Total</td>
                    <td id="totalDailyProtein" />
                    <td id="totalDailyFat" />
                    <td id="totalDailyCarbs" />
                    <td id="totalDailyCalories" />
                    <td />
                    <td id="totalWeeklyProtein" />
                    <td id="totalWeeklyFat" />
                    <td id="totalWeeklyCarbs" />
                    <td id="totalWeeklyCalories" />
                    <td />
                    <td id="totalMonthlyProtein" />
                    <td id="totalMonthlyFat" />
                    <td id="totalMonthlyCarbs" />
                    <td id="totalMonthlyCalories" />
                    <td />
                </tr>
                ${ingredients.map(i => `
                <tr>
                    <td>${i.fdcId}</td>
                    <td>${i.description}</td>
                    <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1003).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
                    <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1004).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
                    <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1005).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
                    <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1008).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
                    <td>${i.dailyConsumptionInGrams}</td>
                    <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1003).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 7)}</td>
                    <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1004).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 7)}</td>
                    <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1005).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 7)}</td>
                    <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1008).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 7)}</td>
                    <td>${i.dailyConsumptionInGrams * 7}</td>
                    <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1003).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 30)}</td>
                    <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1004).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 30)}</td>
                    <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1005).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 30)}</td>
                    <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1008).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 30)}</td>
                    <td>${i.dailyConsumptionInGrams * 30}</td>
                </tr>`)}
            </tbody>
        </table>
        `);

        if (req.method === "POST" && url.pathname === "/foods") {
            const formdata = await req.formData()
            const fdcId = formdata.get('ingredient')
            const consumptionType = formdata.get('consumptionType')
            const consumptionAmountStr = formdata.get('consumptionAmount')
            const consumptionAmountInt = parseInt(consumptionAmountStr)

            const food = data.SRLegacyFoods.find(e => e.fdcId == fdcId)
            
            let dailyConsumptionInGrams = 0
            if (consumptionType === "daily") {
                dailyConsumptionInGrams = consumptionAmountInt
                ingredients.push({ ...food, dailyConsumptionInGrams: dailyConsumptionInGrams })
            }

            if (consumptionType === "weekly") {
                dailyConsumptionInGrams = Math.round(consumptionAmountInt / 7)
                ingredients.push({ ...food, dailyConsumptionInGrams: dailyConsumptionInGrams })
            }

            if (consumptionType === "monthly") {
                dailyConsumptionInGrams = Math.round(consumptionAmountInt / 30)
                ingredients.push({ ...food, dailyConsumptionInGrams: dailyConsumptionInGrams })
            }

            const totalProtein = ingredients
                .map(i => i.foodNutrients.find(e => e.nutrient.id === 1003).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)
                .reduce((acc, curr) => acc + curr)

            const totalFat = ingredients
                .map(i => i.foodNutrients.find(e => e.nutrient.id === 1004).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)
                .reduce((acc, curr) => acc + curr)

            const totalCarbs = ingredients
                .map(i => i.foodNutrients.find(e => e.nutrient.id === 1005).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)
                .reduce((acc, curr) => acc + curr)

            const totalCalories = ingredients
                .map(i => i.foodNutrients.find(e => e.nutrient.id === 1008).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)
                .reduce((acc, curr) => acc + curr)
            
            return new Response(`
            <tr>
                <td>${food.fdcId}</td>
                <td>${food.description}</td>
                <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1003).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
                <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1004).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
                <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1005).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
                <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1008).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
                <td>${dailyConsumptionInGrams}</td>
                <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1003).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 7)}</td>
                <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1004).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 7)}</td>
                <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1005).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 7)}</td>
                <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1008).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 7)}</td>
                <td>${dailyConsumptionInGrams * 7}</td>
                <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1003).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 30)}</td>
                <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1004).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 30)}</td>
                <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1005).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 30)}</td>
                <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1008).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT * 30)}</td>
                <td>${dailyConsumptionInGrams * 30}</td>
            </tr>
            <td id="totalDailyProtein" hx-swap-oob="outerHTML">${Math.round(totalProtein)}</td>
            <td id="totalDailyFat" hx-swap-oob="outerHTML">${Math.round(totalFat)}</td>
            <td id="totalDailyCarbs" hx-swap-oob="outerHTML">${Math.round(totalCarbs)}</td>
            <td id="totalDailyCalories" hx-swap-oob="outerHTML">${Math.round(totalCalories)}</td>
            <td id="totalWeeklyProtein" hx-swap-oob="outerHTML">${Math.round(totalProtein * 7)}</td>
            <td id="totalWeeklyFat" hx-swap-oob="outerHTML">${Math.round(totalFat * 7)}</td>
            <td id="totalWeeklyCarbs" hx-swap-oob="outerHTML">${Math.round(totalCarbs * 7)}</td>
            <td id="totalWeeklyCalories" hx-swap-oob="outerHTML">${Math.round(totalCalories * 7)}</td>
            <td id="totalMonthlyProtein" hx-swap-oob="outerHTML">${Math.round(totalProtein * 30)}</td>
            <td id="totalMonthlyFat" hx-swap-oob="outerHTML">${Math.round(totalFat * 30)}</td>
            <td id="totalMonthlyCarbs" hx-swap-oob="outerHTML">${Math.round(totalCarbs * 30)}</td>
            <td id="totalMonthlyCalories" hx-swap-oob="outerHTML">${Math.round(totalCalories * 30)}</td>

            `)
        };
        return new Response(`<!DOCTYPE html><html>404 Not Found</html>`);
    }
});
