// Submit all the questions of a particular challenge
// sudo npm install puppeteer
const puppeteer = require("puppeteer");
const { id, pw } = require("./credentials");
let tab;
// Chromium => Testing purpose / puppteer knows to interact with chromium(Browser);
// Chrome => Product;

// Open a Browser
// puppeter functions always gives a pending promise;
// puppeteer launches browser in a headless mode
let browserP = puppeteer.launch({
  headless: false,
  defaultViewport:null,
  slowMo:50,
  args:["--start-maximized"]
});
browserP.then(function (browser) {
    let pageOpenedPromise = browser.pages();
    return pageOpenedPromise;
  })
  .then(function (pages) {
    // pages will be an array
    let page = pages[0];
    tab = page;
    let gotoPromise = page.goto("https://www.hackerrank.com/auth/login");
    return gotoPromise;
  })
  .then(function () {
    let idTypedPromise = tab.type("#input-1" , id )
    return idTypedPromise;
  })
  .then(function(){
     let pwTypedPromise = tab.type("#input-2", pw);
     return pwTypedPromise;
  })
  .then(function(){
      let loginPromise = tab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button");
      return loginPromise;
  })
  .then(function(){
      console.log("logged in");
  })
  .catch(function (err) {
    console.log(err);
  });
