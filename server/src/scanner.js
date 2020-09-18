const axios = require("axios");
const cheerio = require("cheerio");

//Extract Source code of given URL
async function getHTML(url) {
  let pattern = new RegExp(/\?.+=.*/g);
  let urlWparam = pattern.test(url);

  urlWparam
    ? (url = `${url}&trc_visible=yes`)
    : (url = `${url}?trc_visible=yes`);
  const { data: html } = await axios.get(url);
  return html;
}

//Check Taboola conditions
async function trc(url) {
  let html = await getHTML(url);
  const $ = cheerio.load(html);
  const [trc, trc1] = await Promise.all([getTRC($), getTRC1($)]);
  let result;
  return trc != "TRC Codes Not Found" || trc1 != "TRC Codes Not Found"
    ? (result = "true")
    : (result = "false");
}

//Checks for Taboola Codes

async function getTRC($) {
  let reg = /\btaboola\b/;
  let trcval = $.html().match(reg);
  let testCount = $('script:contains("_taboola.push")').length;
  //console.log(testCount);
  return trcval ? trcval : (trcval = "TRC Codes Not Found");
}

async function getTRC1($) {
  let reg = /\bwindow._taboola\b/;
  let trcval = $('script[type="text/javascript"]').html();
  let testCount1 = $('script:contains("window._taboola")').length;
  //console.log(testCount1);
  if (trcval !== null) {
    trcval = trcval.match(reg);
  }
  return trcval ? trcval : (trcval = "TRC Codes Not Found");
}

module.exports = { trc };
