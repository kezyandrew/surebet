import { Builder, WebDriver, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import { v4 as uuidv4 } from 'uuid';

export interface BrowserOptions {
  headless?: boolean;
  args?: string[];
}

export class SeleniumBrowser {
  private driver: WebDriver;

  static async create(options: BrowserOptions = {}) {
    const browser = new SeleniumBrowser();
    await browser.initialize(options);
    return browser;
  }

  private async initialize(options: BrowserOptions) {
    // Set up Chrome options
    const chromeOptions = new ChromeOptions();

    if (options.headless) {
      chromeOptions.addArguments('--headless=new');
    }

    if (options.args) {
      options.args.forEach((arg) => chromeOptions.addArguments(arg));
    }

    // Basic recommended options
    chromeOptions.addArguments(
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      `--user-data-dir=/tmp/selenium-${uuidv4()}`, // Use random profile dir
    );

    // Create and store the WebDriver
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();

    // Set reasonable timeouts
    await this.driver.manage().setTimeouts({
      implicit: 10000,
      pageLoad: 30000,
      script: 30000,
    });
  }

  // Basic browser operations
  async goto(url: string) {
    await this.driver.get(url);
  }

  async waitForSelector(selector: string, timeout = 30000) {
    await this.driver.wait(until.elementLocated(By.css(selector)), timeout);
    return this.driver.findElement(By.css(selector));
  }

  async waitForSelectorAll(selector: string, timeout = 30000) {
    await this.driver.wait(until.elementsLocated(By.css(selector)), timeout);
    return this.driver.findElements(By.css(selector));
  }

  async click(selector: string) {
    const element = await this.waitForSelector(selector);
    await element.click();
  }

  async type(selector: string, text: string) {
    const element = await this.waitForSelector(selector);
    await element.sendKeys(text);
  }

  async getText(selector: string) {
    const element = await this.waitForSelector(selector);
    return element.getText();
  }

  async getAttribute(selector: string, attribute: string) {
    const element = await this.waitForSelector(selector);
    return element.getAttribute(attribute);
  }

  async evaluate(script: string, ...args: any[]) {
    return this.driver.executeScript(script, ...args);
  }

  async close() {
    if (this.driver) {
      await this.driver.quit();
    }
  }

  // Get the WebDriver instance for direct access if needed
  getDriver() {
    return this.driver;
  }
}
