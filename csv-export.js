import { readFile, writeFile} from 'fs/promises';
import fs from 'fs';
import { Parser } from 'json2csv';

// Import JSON
const json = JSON.parse(
  await readFile(
    new URL('./data/main_contributer_data.json',
      import.meta.url)
  )
);

// Random uncontacted contributers
let amount = 50;
let randContributers = [];

// Check enough not contacted contributers
let cnt = 0;
json.forEach(contributer => {
  if (!contributer.contacted) cnt++;
});

if (cnt >= amount) {
  while (randContributers.length !== amount) {
    let rand = Math.random()*json.length | 0;
    let rValue = json[rand];
  
    if (!rValue.contacted && !randContributers.includes(rValue)) {
      randContributers.push(rValue);
      json[rand].contacted=true;
    }
  }
} else {
  console.log("Not enough contributers.");
}

if (!fs.existsSync('./data/contributers.csv')) {
  // Update JSON
  const newJSON = JSON.stringify(json, null, 2);
  writeFile('./data/main_contributer_data.json', newJSON, 'utf8', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }
  });
  // console.log(newJSON);

  // Export with single project
  randContributers.forEach( randContributer => {
    while (randContributer.projects.length > 1) {
      randContributer.projects.pop();
    }
    randContributer.projects = randContributer.projects.toString();
  });

  // Export CSV
  const json2csvParser = new Parser({
    quote: ''
  });
  const csv = json2csvParser.parse(randContributers);
  writeFile('./data/contributers.csv', csv, 'utf8', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }
  });
  // console.log(csv);
} else {
  console.log('Extract CSV before continue.');
}
