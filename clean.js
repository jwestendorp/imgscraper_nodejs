import { readFile,writeFile } from 'fs/promises';
const json = JSON.parse(
  await readFile(
    new URL('./data/popular-open-source.json', import.meta.url)
  )
);
let newArray = [];

json.forEach(project => {
    let newObj = {
        "project": project.Project,
        "description": project.Description,
        "repository": project.Repository.slice(12, project.Repository.length),
        "website": project.Website.slice(9, project.Repository.length),
        "contributers": [],
    }
    newArray.push(newObj);
});

const newJSON = JSON.stringify(newArray, null, 2);
  writeFile('./data/clean_output.json', newJSON, 'utf8', (err) => {
    if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }
});