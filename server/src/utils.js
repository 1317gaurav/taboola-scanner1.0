const { trc } = require("./scanner");

// Single Input Scan

async function singleTask(url) {
  try {
    let result = await trc(url);
    return { id: url, url: url, result: result };
  } catch (error) {
    return {
      id: url,
      url: url,
      result: `INCORRECT URL ENTRY ${error.message}`,
    };
  }
}

// Multiple Inputs Scan

async function multiTasker1(urls) {
  console.log(urls.length);
  let results = await urls.map(async (e) => {
    let result;
    try {
      result = await trc(e);
    } catch (error) {
      return { id: e, url: e, result: `INCORRECT URL ENTRY ${error}` };
    }

    return { id: e, url: e, result: result };
  });

  let fres = await Promise.all(results);
  return fres;
}

module.exports = { singleTask, multiTasker1 };
