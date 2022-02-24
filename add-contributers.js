import { readFile, writeFile } from 'fs/promises';
import fs from 'fs';

// import new data
const json = JSON.parse(
  await readFile(
    new URL('./data/scrape_output.json', import.meta.url)
  )
);

let newArray = [];

if (fs.existsSync('./data/main_contributer_data.json')) {
  // import old data
  newArray = JSON.parse(
    await readFile(
      new URL('./data/contributers.json', import.meta.url)
    )
  );
}

json.forEach(project => {
  project.contributers.forEach(contributer => {
    let isContributer = false;
    for (let i = 0; i < newArray.length; i++) {
      if (Object.values(newArray[i]).includes(contributer.name)) {
        isContributer = i;
        break;
      }
    }
    if (isContributer !== false) {
      if (!newArray[isContributer].projects.includes(project.project)){
        newArray[isContributer].projects.push(project.project);
      }
    } else {
      let newContrbuter = {
        "name": contributer.name,
        "email": contributer.email,
        "contacted": false,
        "role": "maintainer",
        "projects": [project.project]
      }
      newArray.push(newContrbuter);
    }
  })
});

// Export JSON
const newJSON = JSON.stringify(newArray, null, 2);
writeFile('./data/main_contributer_data.json', newJSON, 'utf8', (err) => {
  if (err)
  console.log(err);
else {
  console.log("File written successfully\n");
}
});
console.log(newArray.length);
