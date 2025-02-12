import { Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';
import { TestCase as TC } from './Types';
import fs from 'fs';
import { JiraApiHandler } from './JiraApiHandler';

class LivingDocumentation implements Reporter {
  private jiraApiHandler = new JiraApiHandler();

  private testCase: TC = {
    tcId: '',
    testTitle: '',
    testSteps: []
  };

  async onTestEnd(test: TestCase, result: TestResult) {
    this.createTc(test, result);
    await this.saveOrUpdateTcInJira(this.testCase);
  }

  private createTc(test: TestCase, result: TestResult) {
    this.testCase.tcId = test.annotations.filter(ann => ann.type === 'tcId')[0].description!!;
    this.testCase.testTitle = test.title;
    this.testCase.testSteps = 
      result.steps
        .filter(step => !step.title.includes('Hooks'))
        .map(step => step.title);
  }

  private async saveTcToFile() {
    await fs.promises.writeFile(`./helpers/testCases/${this.testCase.tcId}.json`, JSON.stringify(this.testCase, null, 2), {
      flag: 'w'
    });
  }

  private async saveOrUpdateTcInJira(testCase: TC) {
    await this.jiraApiHandler.createOrUpdateJiraTestCase(testCase);
  }
}

export default LivingDocumentation;