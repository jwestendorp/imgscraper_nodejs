import * as cheerio from 'cheerio';

import dotenv from 'dotenv'
import fetch from 'node-fetch';
import fs from 'fs';
import puppeteer from 'puppeteer-extra'
import {
  readFile
} from 'fs/promises';
import { finished } from 'stream';

// Fetch json data
const json = JSON.parse(
  await readFile(
    new URL('./data/popular-open-source_cleaned.json',
      import.meta.url)
  )
);

// Parse .env file
dotenv.config();

// Login
const browser = await userLogin();

// Loop over repositories
json.forEach(async function (repo, repoIndex) {
  setTimeout(
    async function(){
      console.log(repoIndex);

      const response = await fetch(repo.repository);

      await response.text().then((dom) => {
        if (dom) {
          // Parse DOM and nodes
          const $ = cheerio.load(dom);
          const contributors = $('.BorderGrid-cell a[data-hovercard-type=user][data-octo-dimensions=link_type:self]')

          // Create helper arrays
          let contributorURLs = [];


          // Loop through contributor of repository to get their URL
          Object.values(contributors).forEach((contributor) => {
            let link = $(contributor).attr('href');
            link ? contributorURLs.push(link) : '';
          })
          // Loop through contributor URL

          contributorURLs.forEach(async (contributorURL, contributorURLsIndex) => {
            await getContributerEmails(contributorURL, browser, repoIndex);
          });
        } else {
          throw new Error('fetch not successfull');
        }
      });
    }
  ,repoIndex * 8000);
});

async function getContributerEmails(contributorURL, browser, repoIndex){
  await fetchUserMail(contributorURL, browser).then(({
    mail,
    username
  }) => {
    console.log(mail,username);
    addContributerToJson(mail, username, repoIndex);
  });
}

function addContributerToJson(mail, username, repoIndex){
  const isValid = mail != '' && mail != undefined && username != '' && username != undefined
  if (isValid) {
    json[repoIndex].contributers.push({
      "name": username.replace(/(\r\n|\n|\r)/gm, "").replace(/ /g, ""),
      "email": mail
    })
  }
  if(repoIndex + 1 == json.length){
    //last repo
    console.log("last repo");
    setTimeout(async function(){
      //write data
      const newJSON = JSON.stringify(json, null, 2);
      fs.writeFileSync('./data/scrape_output.json', newJSON);

      browser.close();
    }, 10000)
  }
}

async function fetchUserMail(userUrl, browser) {
  try {
    const page = await browser.newPage();
    await page.goto(userUrl, {
      waituntil: 'domcontentloaded',
    });
    await page.waitForSelector('a', {
      timeout: 100000
    });

    const body = await page.evaluate(() => {
      return document.querySelector('body').innerHTML;
    })
    const $ = cheerio.load(body);
    if ($('.u-email').text() != undefined) {
      var mail = $('.u-email').text();
    } else {
      var mail = "";
    }

    var username = $('.p-nickname.vcard-username.d-block').text();

    await page.close();
    return {
      mail: mail,
      username: username
    };
  } catch (error) {
    console.log(error);
  }
}

async function userLogin() {
  try {
    // Open browser
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 720
    });

    // Open login page
    const loginUrl = 'https://github.com/login';
    await page.goto(loginUrl, {
      waitUntil: 'networkidle0'
    }); // wait until page load

    // Put in credentials
    await page.type('#login_field', process.env.USER_ID);
    await page.type('#password', process.env.USER_PASS);

    // Click and wait for navigation
    await Promise.all([
      page.click('.btn.btn-primary.btn-block.js-sign-in-button'),
      page.waitForNavigation({
        waitUntil: 'networkidle0'
      }),
    ]);
    return browser;
  } catch (error) {
    console.log(error);
    return false;
  }
}