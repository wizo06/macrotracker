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
        if (req.method === "GET" && url.pathname === "/") return new Response(Bun.file('base.html'));
        if (req.method === "GET" && url.pathname === "/ingredients") return new Response(`${Form()}${Table()}`);
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
            
            return new Response(`${NewRow(food, dailyConsumptionInGrams, totalProtein, totalFat, totalCarbs, totalCalories)}`)
        };
        return new Response(`<!DOCTYPE html><html>404 Not Found</html>`);
    }
});

const Form = () => `
<form hx-post="/foods" hx-target="#insertAfterMe" hx-swap="beforeend">
    <div class="grid">
        <div>
            <label>Ingredients</label>
            <input list="ingredient" name="ingredient" required />
            <datalist id="ingredient">
                ${data.SRLegacyFoods.map(f => `<option value="${f.fdcId}">${f.description}</option>`)}
            </datalist>
        </div>
        <div>
            <label>Consumption amount (grams)</label>
            <input type="number" name="consumptionAmount" required />    
        </div>
        <div>
            <input id="daily" type="radio" name="consumptionType" value="daily" checked />
            <label for="daily">Daily</label>
            <br />
            <input id="weekly" type="radio" name="consumptionType" value="weekly" />
            <label for="weekly">Weekly</label>                
            <br />
            <input id="monthly" type="radio" name="consumptionType" value="monthly" />
            <label for="monthly">Monthly</label>
        </div>    
    </div>
    <input type="submit" value="Add" />
</form>
`

const Table = () => `
<table>
    <thead>
        <tr>
            <th scope="col">ID</th>
            <th scope="col">Ingredient</th>
            <th scope="col"><span data-tooltip="Protein (grams)">🥩</span></th>
            <th scope="col"><span data-tooltip="Fat (grams)">🥑</span></th>
            <th scope="col"><span data-tooltip="Carbs (grams)">🍠</span></th>
            <th scope="col"><span data-tooltip="Calories (kcal)">⚡</span></th>
            <th scope="col"><span data-tooltip="Price (USD)">💵</span></th>
            <th scope="col"><span data-tooltip="Daily Consumption (grams)">☀️</span></th>
            <th scope="col"><span data-tooltip="Weekly Consumption (grams)">7️⃣</span></th>
            <th scope="col"><span data-tooltip="Monthly Consumption (grams)">🌙</span></th>
        </tr>
    </thead>
    <tbody id="insertAfterMe">
        ${ingredients.map(i => `
        <tr>
            <td scope="row">${i.fdcId}</td>
            <td>${i.description}</td>
            <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1003).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
            <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1004).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
            <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1005).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
            <td>${Math.round(i.foodNutrients.find(e => e.nutrient.id === 1008).amount * i.dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
            <td />
            <td>${i.dailyConsumptionInGrams}</td>
            <td>${i.dailyConsumptionInGrams * 7}</td>
            <td>${i.dailyConsumptionInGrams * 30}</td>
        </tr>`)}
    </tbody>
    <tfoot>
        <tr>
            <th scope="col">Total</td>
            <td />
            <td id="totalDailyProtein" />
            <td id="totalDailyFat" />
            <td id="totalDailyCarbs" />
            <td id="totalDailyCalories" />
            <td id="totalDailyPrice" />
            <td />
            <td />
            <td />
        </tr>
    </tfoot>
</table>
`

const NewRow = (food, dailyConsumptionInGrams, totalProtein, totalFat, totalCarbs, totalCalories) => `
<tr>
    <td scope="row">${food.fdcId}</td>
    <td>${food.description}</td>
    <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1003).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
    <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1004).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
    <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1005).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
    <td>${Math.round(food.foodNutrients.find(e => e.nutrient.id === 1008).amount * dailyConsumptionInGrams / SERVING_SIZE_IN_GRAMS_PER_NUTRIENT_AMOUNT)}</td>
    <td />
    <td>${dailyConsumptionInGrams}</td>
    <td>${dailyConsumptionInGrams * 7}</td>
    <td>${dailyConsumptionInGrams * 30}</td>
</tr>
<td id="totalDailyProtein" hx-swap-oob="outerHTML">${Math.round(totalProtein)}</td>
<td id="totalDailyFat" hx-swap-oob="outerHTML">${Math.round(totalFat)}</td>
<td id="totalDailyCarbs" hx-swap-oob="outerHTML">${Math.round(totalCarbs)}</td>
<td id="totalDailyCalories" hx-swap-oob="outerHTML">${Math.round(totalCalories)}</td>
<td id="totalDailyPrice" hx-swap-oob="outerHTML">$$$</td>
`
