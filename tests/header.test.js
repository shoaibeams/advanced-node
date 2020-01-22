const Page = require('./helpers/page')

let page

// beforeEach is automatically executed before every single test
beforeEach(async () => {
  // an object represents running browser window
  // headless: false means there will be interface
  // of the browser to interact

  page = await Page.build()
  await page.goto('localhost:3000')
  const text = await page.getContentsOf('a.brand-logo')

  expect(text).toEqual('Blogster')
})

afterEach(async () => {
  await page.close()
})

test('The header has the correct test', async () => {
  const text = await page.getContentsOf('a.brand-logo')

  expect(text).toEqual('Blogster')
})

test('Clicking login starts oauth flow', async () => {
  await page.click('.right a')
  const url = await page.url()
  expect(url).toMatch(/accounts\.google\.com/)
})

//test.only means only this test will be executed
test('When signed in, shows logout button', async () => {
  await page.login()
  const text = await page.getContentsOf('a[href="/auth/logout"]')

  expect(text).toEqual('Logout')
})
