const SERVER_URL = 'http://localhost:3333';

describe('User Flow', () => {
  let timestampedUsername;
  let token;

  it('should allow a user to register', async () => {
    await page.goto(SERVER_URL);
    await page.waitForSelector('[name="register-username"]');

    timestampedUsername = 'newUsername' + Date.now();
    await page.type('[name="register-username"]', timestampedUsername);
    await page.type('[name="register-password"]', 'newPassword');
    await page.click('[name="register-submit"]');

    await page.waitForNavigation();
    await page.waitForTimeout(1000);
    expect(page.url()).toBe(`${SERVER_URL}/list`);
  });

  it('should allow the registered user to login', async () => {
    await page.goto(`${SERVER_URL}`);

    await page.waitForSelector('[name="login-username"]');
    await page.type('[name="login-username"]', timestampedUsername);
    await page.type('[name="login-password"]', 'newPassword');

    await page.click('[name="login-submit"]');

    await page.waitForNavigation();
    await page.waitForTimeout(1000);

    await expect(page.url()).toBe(`${SERVER_URL}/list`);
    token = await page.evaluate(() => localStorage.getItem('auth_token'));
  }, 90000);

  it('should allow the user to update their details', async () => {
    await page.goto(`${SERVER_URL}/edit/${timestampedUsername}`);

    await page.waitForSelector('[name="edit-username"]');

    const updatedUsername = `${timestampedUsername}_updated`;

    await page.focus('[name="edit-username"]');
    for (let i = 0; i < timestampedUsername.length; i++) {
      await page.keyboard.press('Backspace');
    }

    await page.type('[name="edit-username"]', updatedUsername);
    await page.type('[name="edit-password"]', 'newPassword');

    await page.click('[name="edit-submit"]');

    await page.waitForTimeout(1000);

    const displayedUsername = await page.$eval('h2 strong', el => el.textContent);
    expect(displayedUsername).toBe(updatedUsername);

    expect(page.url()).toBe(`${SERVER_URL}/edit/${updatedUsername}`);
  }, 15000);

});
