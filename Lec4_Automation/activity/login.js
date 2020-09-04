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
      // parallely click and wait for navigation
      // clickedPromise and waitForNavigation promise are pending.
      let clickedPromise = tab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button");
      //networkidle0 => the moment when there is no request from the webPage for 500ms
      let waitForNavigation = tab.waitForNavigation({waitUntil:"networkidle0"});
      // paralley task started and promise.all will wait for all the pending promises to be resolved();
      let navigatedPromise = Promise.all([ clickedPromise , waitForNavigation ]); 
      return navigatedPromise;
  })
  .then(function(){
      let ipKitClicked = tab.click("#base-card-1-link");
      let waitForNavigation = tab.waitForNavigation({waitUntil:"networkidle0"});
      let navigatedPromise = Promise.all([ ipKitClicked , waitForNavigation ]); 
      return navigatedPromise;
  }).then(function(){
      let waitPromise = tab.waitForSelector('a[data-attr1="warmup"]' , {visible:true});
      return waitPromise;
  })
  .then(function(){
      let warmupClicked = tab.click('a[data-attr1="warmup"]');
      let waitForNavigation = tab.waitForNavigation({waitUntil:"networkidle0"});
      let navigatedPromise = Promise.all([ warmupClicked , waitForNavigation ]); 
      return navigatedPromise;
  })
  .then(function(){
    let waitPromise = tab.waitForSelector(".js-track-click.challenge-list-item" , {visible:true});
    return waitPromise;
  })
  .then(function(){
      // document.querySelectorAll
      // Array with pending promises => resolved
      let allATagsPromise = tab.$$(".js-track-click.challenge-list-item")
      return allATagsPromise;
  })
  .then(function(allTags){
      // it will contain all the pending promises of links of questions and later will be resolved to links
      let linksPromise = [];
      // tab.evaluate takes two parameter
      // tab.evaluate( function=> how to evaluate this element , element to be evaluated );
    for(let i=0 ; i<allTags.length ; i++){
        let linkP = tab.evaluate( function(elem){ return elem.getAttribute("href")  }  , allTags[i] );
        linksPromise.push(linkP);
    }
    let allLinksPromise = Promise.all(linksPromise);
    return allLinksPromise;
  }).then(function(allLinks){
      console.log(allLinks);
  })
  .catch(function (err) {
    console.log(err);
  });
