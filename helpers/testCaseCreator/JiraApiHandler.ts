import { API_URL, ISSUE_TYPE_ID, ISSUE_TYPE_NAME, JIRA_HEADERS, PROJECT_ID } from "./JiraConfig";
import { TestCase } from "./Types";
import axios, { AxiosResponse } from 'axios';

export class JiraApiHandler {
  #issueDetails: AxiosResponse | null;
  
  constructor() {}

  async createOrUpdateJiraTestCase(testCase: TestCase) {
    if(!testCase.tcId) return;
    
    await this.getIssueDetails(testCase.tcId);

    if(this.isTestCaseAlreadyCreated()) {      
      if(!this.isIssueOfTypeTestCase()) {
        throw Error(`ISSUE TYPE MUST BE '${ISSUE_TYPE_NAME}'! ISSUE ID ${testCase.tcId} TYPE IS '${this.#issueDetails?.data.fields.issuetype.name}'!`);
      }

      await this.updateJiraTestCase(testCase);
    } else {
      await this.createJiraTestCase(testCase);
    }
  }

  private async createJiraTestCase(testCase: TestCase) {
    const { testTitle, testSteps } = testCase;
  
    const description = this.formatDescription(testSteps);
      
    const payload = {
      fields: {
        project: {
          id: PROJECT_ID
        },
        summary: testTitle,
        description: description,
        issuetype: {
          id: ISSUE_TYPE_ID
        }
      }
    };
  
    try {
      const response = await axios.post(
        `${API_URL}/issue`,
        payload,
        {
          headers: JIRA_HEADERS
        }
      );
      console.log('Test case created:', response.data);
    } catch (error) {
      console.error('Error creating test case:', error);
    }
  };

  private async updateJiraTestCase(testCase: TestCase) {
    const { tcId, testTitle, testSteps } = testCase;

    const description = this.formatDescription(testSteps);
      
    const payload = {
      fields: {
        project: {
          id: PROJECT_ID
        },
        summary: testTitle,
        description: description,
        issuetype: {
          id: ISSUE_TYPE_ID
        }
      }
    };
  
    try {
      const response = await axios.put(
        `${API_URL}/issue/${tcId}`,
        payload,
        {
          headers: JIRA_HEADERS
        }
      );
      console.log(`Test case ${tcId} updated.`);
    } catch (error) {
      console.error('Error updating test case:', error);
    }
  }

  private async getIssueDetails(id: string) {
    let response: AxiosResponse | null = null;
    try {
      response = await axios.get(`${API_URL}/issue/${id}`, 
        { headers: JIRA_HEADERS }
      );
    } catch(error) {
      if(error.status !== 404) {
        console.log(error);
      }
    }
    
    this.#issueDetails = response;
  }

  private isTestCaseAlreadyCreated() {
    return this.#issueDetails !== null;
  }

  private isIssueOfTypeTestCase() {
    return this.#issueDetails?.data.fields.issuetype.name === ISSUE_TYPE_NAME;
  }

  private formatDescription(testSteps: string[]) {
    const description = testSteps
      .map((step, index) => `${index + 1}. ${step}`)
      .join('\n');

    const adfDescription = {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              text: description,
              type: "text"
            }
          ]
        }
      ]
    };

    return adfDescription;
  }
}