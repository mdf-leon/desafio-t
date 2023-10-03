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
  });



  // it('should allow the user to update permissions', async () => {
  //   await page.goto(`${SERVER_URL}/edit/${timestampedUsername}/permissions`); // Updated route for editing permissions

  //   await page.click('[name="permission-toggle"]');
  //   await page.click('[name="update-permissions-submit"]');

  //   await page.waitForTimeout(1000);
  // });

  // it('should allow the user to delete their account', async () => {
  //   await page.goto(`${SERVER_URL}/edit/${timestampedUsername}`); // Back to the user editing page to delete account

  //   await page.click('[name="delete-account-button"]');
  //   await page.waitForSelector('[name="confirm-delete"]'); // Assumption: A confirmation dialog appears
  //   await page.click('[name="confirm-delete"]');

  //   await page.waitForNavigation();
  //   await page.waitForTimeout(1000);
  //   expect(page.url()).toBe(`${SERVER_URL}/list`); // After deletion, I assume the user is redirected back to the list
  // });
});


// it('should allow the user to update their details', async () => {
//   await page.goto(`${SERVER_URL}/profile`); // Assumption: you have a dedicated profile/edit page

//   await page.type('[name="user-email"]', `${timestampedUsername}@test.com`);
//   await page.click('[name="update-profile-submit"]');

//   await page.waitForTimeout(1000);
// });

// it('should allow the user to update permissions', async () => {
//   await page.goto(`${SERVER_URL}/permissions`); // Assumption: dedicated permissions page

//   await page.click('[name="permission-toggle"]');
//   await page.click('[name="update-permissions-submit"]');

//   await page.waitForTimeout(1000);
// });

// it('should allow the user to delete their account', async () => {
//   await page.goto(`${SERVER_URL}/profile`); // Back to profile to delete account

//   await page.click('[name="delete-account-button"]');
//   await page.waitForSelector('[name="confirm-delete"]'); // Assumption: A confirmation dialog appears
//   await page.click('[name="confirm-delete"]');

//   await page.waitForNavigation();
//   await page.waitForTimeout(1000);
//   expect(page.url()).toBe(`${SERVER_URL}/goodbye`); // Assumption: Redirected to a goodbye or home page after deletion
// });