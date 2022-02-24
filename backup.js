import {
  readdir,
  copyFile,
  unlink
} from 'fs/promises';

const dataPaths = await readdir("./data/");
const backupPaths = await readdir("./backup/");


backupPaths.forEach(async function (path, pathIndex) {
  await unlink("backup/" + path);
})
dataPaths.forEach(async function (path, pathIndex) {
  await copyFile("data/" + path, "backup/" + path, 0);
})
