import { FullResult, Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';
import { TestCase as TC } from './Types';
import fs from 'fs';
import { JiraApiHandler } from './JiraApiHandler';

class LivingDocumentation implements Reporter {
  private pendingOperations: Promise<any>[] = [];
  
  // private testCase: TC = {
  //   tcId: undefined,
  //   testTitle: '',
  //   testSteps: []
  // };
  
  async onTestEnd(test: TestCase, result: TestResult) {
    const createdTestCase = this.createTc(test, result);
    
    if(!createdTestCase) return;

    const jiraApiHandler = new JiraApiHandler();
    
    const operation = jiraApiHandler.createOrUpdateJiraTestCase(createdTestCase);
    this.pendingOperations.push(operation);
  }

  async onEnd(result: FullResult) {
    await Promise.all(this.pendingOperations);
    console.log('All Jira operations completed.');
  }

  private createTc(test: TestCase, result: TestResult): TC | void {
    const tcId = test.annotations.filter(ann => ann.type === 'testCaseId')[0]?.description;
    const shouldBeUpdated = test.annotations.filter(ann => ann.type === 'updateTestCase')[0]?.description;

    if(!shouldBeUpdated || shouldBeUpdated === 'false') {
      return;
    }

    const testSteps = 
      result.steps
        .filter(step => !step.title.includes('Hooks'))
        .map(step => step.title);

    return {
      tcId: tcId,
      testTitle: test.title,
      testSteps: testSteps
    }

    // this.testCase.tcId = tcId;
    // this.testCase.testTitle = test.title;
    // this.testCase.testSteps = 
    //   result.steps
    //     .filter(step => !step.title.includes('Hooks'))
    //     .map(step => step.title);
  }
}

export default LivingDocumentation;