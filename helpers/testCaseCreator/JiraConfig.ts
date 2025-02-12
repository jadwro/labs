import * as dotenv from 'dotEnv';

dotenv.config();

export const API_URL = 'https://jadwro.atlassian.net/rest/api/3';
export const PROJECT_ID = '10000';
export const ISSUE_TYPE_ID = '10016';
export const ISSUE_TYPE_NAME = 'Test Case';
export const JIRA_HEADERS = {
  "Authorization": `Basic ${Buffer.from(
      `jadwro@gmail.com:${process.env.JIRA_API_TOKEN}`
    ).toString('base64')}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
}