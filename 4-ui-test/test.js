const assert = require('assert');
const { test, suite } = require('mocha');
const {Builder, Browser, By, until} = require('selenium-webdriver');

suite('UI test', function() {
    this.timeout(0);
    let driver = null;

    before(async function() {
        driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    });

    test('test 1', async function() {
        await driver.get('http://localhost/twoa01/login.html');
        let login = await driver.findElement(By.id('login'));
        let password = await driver.findElement(By.id('password'));
        let button = await driver.findElement(By.css('button[type=submit]'));
        await login.sendKeys('user');
        await password.sendKeys('password');
        await button.click();
        let h3 = await driver.findElement(By.css('h3'));
        await assert.equal(await h3.getText(), 'Ошибка');
    });

    test('test 2', async function() {
        await driver.get('http://localhost/twoa01/login.html');
        let login = await driver.findElement(By.id('login'));
        let password = await driver.findElement(By.id('password'));
        let button = await driver.findElement(By.css('button[type=submit]'));
        await login.sendKeys('ivanov');
        await password.sendKeys('12345');
        await button.click();
        let url = await driver.getCurrentUrl();
        await assert.equal(url, 'http://localhost/twoa01/task/list.html');
    });

    after(async function() {
        await driver.quit();
    });
});
