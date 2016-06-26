COLS=(co2percapita popwithelecpercentage co2emissions metanoemissions metanobyagriculture niox nioxbyagriculture othergreengases internetusers elecconsumptionpercapita urbanpopulationpercentage energyfromfossils population populationchange)

FILES=(01.json 02.json 03.json 04.json 05.json 06.json 07.json 08.json 09.json 10.json 11.json 12.json 13.json 14.json)

for i in ${!FILES[@]}
  do
    mongoimport --file ${FILES[i]} --db danielurencio --collection ${COLS[i]} --jsonArray
done
