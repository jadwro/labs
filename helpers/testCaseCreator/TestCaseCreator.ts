import { FullResult, Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';
import { TestCase as TC } from './Types';
import fs from 'fs';
import { JiraApiHandler } from './JiraApiHandler';

class LivingDocumentation implements Reporter {
  private pendingOperations: Promise<any>[] = [];
  
  private testCase: TC = {
    tcId: '',
    testTitle: '',
    testSteps: []
  };
  
  async onTestEnd(test: TestCase, result: TestResult) {
    const jiraApiHandler = new JiraApiHandler();

    this.createTc(test, result);
    
    const operation = jiraApiHandler.createOrUpdateJiraTestCase(this.testCase);
    this.pendingOperations.push(operation);
  }

  async onEnd(result: FullResult) {
    await Promise.all(this.pendingOperations);
    console.log('All Jira operations completed.');
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
}

export default LivingDocumentation;