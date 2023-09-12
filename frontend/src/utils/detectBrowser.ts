function detectBrowser() {
  const userAgent = navigator.userAgent;
  let browser;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browser = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browser = "firefox";
  } else if (userAgent.match(/safari/i)) {
    browser = "safari";
  } else if (userAgent.match(/opr\//i)) {
    browser = "opera";
  } else if (userAgent.match(/edg/i)) {
    browser = "edge";
  }

  return browser;
}

export default detectBrowser;
