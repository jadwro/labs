import { test } from '@playwright/test';
import { LoginPage } from '../helpers/pageObjects/LoginPage';
import { SuccessPage } from '../helpers/pageObjects/SuccessPage';

const Login = 'student';
const CorrectPsw = 'Password123';
const IncorrectPsw = 'xxx';

test('Successful login', 
  { 
    annotation: [
      { type: 'tcId', description: 'SCRUM-9' },
      { type: 'update', description: 'false' }
    ]
  }, 
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    const successPage = new SuccessPage(page);

    await test.step('GIVEN I am on the login page', async () => {
      await page.goto('https://practicetestautomation.com/practice-test-login/');
    });
    
    await test.step(`WHEN I enter correct login credentials (${Login} : ${CorrectPsw})`, async () => {
      await loginPage.enterLoginData(Login, CorrectPsw);
    });
    
    await test.step('AND I click submit button', async () => {
      await loginPage.clickSubmitBtn();
    });

    await test.step('THEN I should be logged in successfully', async () => {
      await successPage.verifySuccessText();
    });
});

test('Login with wrong password is not possible', 
  { 
    annotation: [
      { type: 'tcId', description: 'SCRUM-10' },
      { type: 'update', description: 'false' }
    ]
  }, 
  async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('GIVEN I am on the login page', async () => {
      await page.goto('https://practicetestautomation.com/practice-test-login/');
    });
    
    await test.step(`WHEN I enter incorrect password (${Login} : ${IncorrectPsw})`, async () => {
      await loginPage.enterLoginData(Login, IncorrectPsw);
      await loginPage.clickSubmitBtn();
    });
    
    await test.step(`THEN I can see error message with text '${loginPage.wrongPasswordMessage}'`, async () => {
      await loginPage.verifyErrorMessage(loginPage.wrongPasswordMessage);
    });
});

test('New test', 
  { 
    annotation: [
      { type: 'testCaseId', description: 'xxx' },
      { type: 'updateTestCase', description: 'false' }
    ]
  }, 
  async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('GIVEN I am on the login page', async () => {
      await page.goto('https://practicetestautomation.com/practice-test-login/');
    });
    
    await test.step(`WHEN I enter incorrect password (${Login} : ${IncorrectPsw})`, async () => {
      await loginPage.enterLoginData(Login, IncorrectPsw);
      await loginPage.clickSubmitBtn();
    });
    
    await test.step(`THEN I can see error message with text '${loginPage.wrongPasswordMessage}'`, async () => {
      await loginPage.verifyErrorMessage(loginPage.wrongPasswordMessage);
    });
});