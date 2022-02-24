# lost-weekend

> Please Do not run add-contributers if you do not want to imediatly send mails

## Script 1: clean.js

The script cleans the json object and adds the contributers key as a empty array of contributer objects.
Output: clean_output.json

```
npm run clean
```

## Script 2: scrape.js

The script scrapes mails from github and writes them into the the contibuters array of the repo list.
Output: scrape_output.json

```
npm run scrape
```

## Script 3: add-contibuters.js

The script adds contributer to main contributer data and checks if contributer are already there.
Updates: main_contributer_data.json

```
npm run add-contributers
```

## Script 4: csv-export.js

The script exports contributer to csv format and changes contacted property to true.
Output: contributer.csv
Updates: main_contributer_data.json

```
npm run export
```

## Script 5: backup.js

The script backups the files in the data folder into the backup folder.
Output: backup/*

```
npm run backup
```
