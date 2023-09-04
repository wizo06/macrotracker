#!/bin/bash

# cat FoodData_Central_sr_legacy_food_json_2021-10-28.json | jq '.SRLegacyFoods | length'

CONTENT=$(cat FoodData_Central_sr_legacy_food_json_2021-10-28.json)
echo $CONTENT | jq '.SRLegacyFoods' | jq -c '.[0:1948]' > part1.json
echo $CONTENT | jq '.SRLegacyFoods' | jq -c '.[1948:3896]' > part2.json
echo $CONTENT | jq '.SRLegacyFoods' | jq -c '.[3896:5844]' > part3.json
echo $CONTENT | jq '.SRLegacyFoods' | jq -c '.[5844:]' > part4.json
