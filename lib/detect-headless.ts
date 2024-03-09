// @ts-nocheck
enum HeadlessStatus {
  HEADLESS,
  HEADFUL,
  UNKNOWN,
}

function testUserAgent() {
  return /headless/i.test(navigator.userAgent)
    ? HeadlessStatus.HEADLESS
    : HeadlessStatus.UNKNOWN
}

function testAppVersion() {
  return /headless/i.test(navigator.appVersion)
    ? HeadlessStatus.HEADLESS
    : HeadlessStatus.UNKNOWN
}

function testPluginsPrototype() {
  let correctPrototypes = PluginArray.prototype === navigator.plugins.__proto__
  if (navigator.plugins.length > 0)
    correctPrototypes &= Plugin.prototype === navigator.plugins[0].__proto__

  return correctPrototypes ? HeadlessStatus.HEADFUL : HeadlessStatus.HEADLESS
}

function testPlugins() {
  return navigator.plugins.length === 0
    ? HeadlessStatus.UNKNOWN
    : testPluginsPrototype()
}

function testMimePrototype() {
  let correctPrototypes =
    MimeTypeArray.prototype === navigator.mimeTypes.__proto__
  if (navigator.mimeTypes.length > 0)
    correctPrototypes &= MimeType.prototype === navigator.mimeTypes[0].__proto__

  return correctPrototypes ? HeadlessStatus.HEADFUL : HeadlessStatus.HEADLESS
}

function testMime() {
  return navigator.mimeTypes.length === 0
    ? HeadlessStatus.UNKNOWN
    : testMimePrototype()
}

function testLanguages() {
  const language = navigator.language
  if (!language || language.length === 0) return HeadlessStatus.HEADLESS
  return HeadlessStatus.HEADFUL
}

function testWebDriver() {
  return navigator.webdriver ? HeadlessStatus.HEADLESS : HeadlessStatus.HEADFUL
}

function testConnectionRtt() {
  const connection = navigator.connection
  if (!connection) return HeadlessStatus.UNKNOWN
  return connection.rtt === 0 ? HeadlessStatus.HEADLESS : HeadlessStatus.HEADFUL
}

export function isHeadless() {
  return [
    testUserAgent,
    testAppVersion,
    testPlugins,
    testMime,
    testLanguages,
    testWebDriver,
    testConnectionRtt,
  ].some((func) => func() === HeadlessStatus.HEADLESS)
}
