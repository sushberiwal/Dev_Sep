// Submit all the questions of a particular challenge
// sudo npm install puppeteer
const puppeteer = require("puppeteer");
const { id, pw } = require("./credentials");
let tab;
let gCodesElement;
let gCode;
// Chromium => Testing purpose / puppteer knows to interact with chromium(Browser);
// Chrome => Product;

// Open a Browser
// puppeter functions always gives a pending promise;
// puppeteer launches browser in a headless mode
let browserP = puppeteer.launch({
  headless: false,
  defaultViewport: null,
  // slowMo: 50,
  args: ["--start-maximized"],
});
browserP
  .then(function (browser) {
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
    let idTypedPromise = tab.type("#input-1", id);
    return idTypedPromise;
  })
  .then(function () {
    let pwTypedPromise = tab.type("#input-2", pw);
    return pwTypedPromise;
  })
  .then(function () {
    // parallely click and wait for navigation
    // clickedPromise and waitForNavigation promise are pending.
    //networkidle0 => the moment when there is no request from the webPage for 500ms
    // paralley task started and promise.all will wait for all the pending promises to be resolved();
    let clickAndWaitP = clickAndWait(".ui-btn.ui-btn-large.ui-btn-primary.auth-button");
    return clickAndWaitP;
  })
  .then(function () {
    let clickAndWaitP = clickAndWait("#base-card-1-link");
    return clickAndWaitP;
  })
  .then(function () {
    let waitPromise = tab.waitForSelector('a[data-attr1="warmup"]', {
      visible: true,
    });
    return waitPromise;
  })
  .then(function () {
    let clickAndWaitP = clickAndWait('a[data-attr1="warmup"]');
    return clickAndWaitP;
  })
  .then(function () {
    let waitPromise = tab.waitForSelector(
      ".js-track-click.challenge-list-item",
      { visible: true }
    );
    return waitPromise;
  })
  .then(function () {
    // document.querySelectorAll
    // Array with pending promises => resolved
    let allATagsPromise = tab.$$(".js-track-click.challenge-list-item");
    return allATagsPromise;
  })
  .then(function (allTags) {
    // it will contain all the pending promises of links of questions and later will be resolved to links
    let linksPromise = [];
    // tab.evaluate takes two parameter
    // tab.evaluate( function=> how to evaluate this element , element to be evaluated );
    for (let i = 0; i < allTags.length; i++) {
      let linkP = tab.evaluate(function (elem) {
        return elem.getAttribute("href");
      }, allTags[i]);
      linksPromise.push(linkP);
    }
    let allLinksPromise = Promise.all(linksPromise);
    return allLinksPromise;
  })
  .then(function (allLinks) {
    // console.log(allLinks);
    let completeLinksArr = [];
    for (let i = 0; i < allLinks.length; i++) {
      let completeLink = `https://www.hackerrank.com${allLinks[i]}`;
      completeLinksArr.push(completeLink);
    }
    // console.log(completeLinksArr);
    // questionSubmitter gives a pending promise
    let oneQuestionPromise = questionSubmitter(completeLinksArr[0]);
    return oneQuestionPromise;
  })
  .then(function () {
    console.log("One question submited !");
  })
  .catch(function (err) {
    console.log(err);
  });

  

function clickAndWait(selector){
  return new Promise(function(resolve , reject){
    let ipKitClicked = tab.click(selector);
    let waitForNavigation = tab.waitForNavigation({
      waitUntil: "networkidle0",
    });
    let navigatedPromise = Promise.all([ipKitClicked, waitForNavigation]);
    navigatedPromise.then(function(){
      resolve();
    })
    navigatedPromise.catch(function(){
      reject();
    })
  })
}

function getCode() {
  let pendingPromise = new Promise(function (resolve, reject) {
    let elemFound = tab.waitForSelector(".hackdown-content h3", {
      visible: true,
    });
    elemFound
      .then(function () {
        let codeNameH3elementPromise = tab.$$(".hackdown-content h3");
        let codesElementPromise = tab.$$(".hackdown-content .highlight");
        let codeNamesAndCodePromise = Promise.all([
          codeNameH3elementPromise,
          codesElementPromise,
        ]);
        return codeNamesAndCodePromise;
      })
      .then(function (namesAndCodes) {
        let codeNamesElement = namesAndCodes[0];
        // console.log("codenames " + codeNamesElement.length);
        gCodesElement = namesAndCodes[1];
        // console.log("codes" + codesElement.length);
        // it will contain all the promises of names of codes
        let codeNamesPromise = [];
        for (let i = 0; i < codeNamesElement.length; i++) {
          let codeNameP = tab.evaluate(function (elem) {
            return elem.textContent;
          }, codeNamesElement[i]);
          codeNamesPromise.push(codeNameP);
        }
        let allNamesP = Promise.all(codeNamesPromise);
        return allNamesP;
      })
      .then(function (codeNames) {
        console.log(codeNames);
        let idx;
        for (let i = 0; i < codeNames.length; i++) {
          if (codeNames[i] == "C++") {
            idx = i;
            break;
          }
        }
        let codeElement = gCodesElement[idx];
        let codeElementP = tab.evaluate(function (elem) {
          return elem.textContent;
        }, codeElement);
        return codeElementP;
      })
      .then(function (code) {
        gCode = code;
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
  return pendingPromise;
}

function pasteCode(){
  return new Promise(function(resolve , reject){
    let clickP = tab.click('a[data-attr2="Problem"]');
    clickP.then(function(){
      let waitP = tab.waitForSelector(".custom-input-checkbox" , {visible:true});
      return waitP;
    }).then(function(){
      let customCheckedP = tab.click(".custom-input-checkbox");
      return customCheckedP;
    }).then(function(){
      let codeTypedPromise = tab.type(".custominput" , gCode);
      return codeTypedPromise;
    }).then(function(){
      let controlHold = tab.keyboard.down("Control");
      return controlHold;
    }).then(function(){
      let aPressed = tab.keyboard.press("A");
      return aPressed;
    }).then(function(){
      let xPressed = tab.keyboard.press("X");
      return xPressed;
    }).then(function(){
      let CodeBoxSelected = tab.click(".monaco-scrollable-element.editor-scrollable.vs");
      return CodeBoxSelected;
    }).then(function(){
      let aPressed = tab.keyboard.press("A");
      return aPressed;
    }).then(function(){
      let vPressed = tab.keyboard.press("V");
      return vPressed;
    }).then(function(){
      resolve();
    }).catch(function(err){
      reject(err);
    })
  });
}

function questionSubmitter(link) {
  let pendingPromise = new Promise(function (resolve, reject) {
    let gotoPromise = tab.goto(link);
    let waitForNavigationPromise = tab.waitForNavigation({
      waitUntil: "networkidle0",
    });
    // promise.all use case => when we want to do things parallely
    let clickAndWaitPromise = Promise.all([
      gotoPromise,
      waitForNavigationPromise,
    ]);
    clickAndWaitPromise
      .then(function () {
        let waitForSelectorP = tab.waitForSelector(
          'a[data-attr2="Editorial"]',
          { visible: true }
        );
        return waitForSelectorP;
      })
      .then(function () {
       let clickAndWaitP = clickAndWait('a[data-attr2="Editorial"]');
       return clickAndWaitP;
      })
      .then(function () {
        let getCodeP = getCode();
        return getCodeP;
      })
      .then(function () {
        let pasteCodeP = pasteCode();
        return pasteCodeP;
      })
      .then(function () {
        let submitPressed = tab.click(".pull-right.btn.btn-primary.hr-monaco-submit")
        return submitPressed;
      })
      .then(function(){
        console.log("Question Submitted Successfully !!!");
        resolve();
      })
      .catch(function(err){
        reject(err);
      })
  });
  return pendingPromise;
}
