import base64 from 'base-64';
import fetch from 'node-fetch';

import { API_URL } from '../config/jiraConfig.json';

import { Comment, transformCommentsResponse } from '../model/jira/Comment';
import { transformUsersResponse, User } from '../model/jira/User';
import { Issue } from './../model/jira/Issue';
import { transformStatusLogsResponse } from './../model/jira/StatusLog';

export class JiraService {
    public async getIssues() {
        const issuesResponse = await fetch(`${API_URL}/search?jql=project=SCHOOL%20and%20updated%20>=%20-2h&expand=changelog`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(process.env.JIRA_AUTH)
            },
        })
            .then((response) => response.json())
            .catch((error) => console.warn(error));

        const issues: Issue[] = await Promise.all(issuesResponse.issues.map(async (issueRaw) => ({
            key: issueRaw.key,
            name: issueRaw.fields.summary,
            statusLogs: transformStatusLogsResponse(issueRaw.changelog.histories),
            watchers: await this.getIssueWatchers(issueRaw.key),
            comments: await this.getIssueComments(issueRaw.key)
        })));

        return issues;
    }

    public getIssueWatchers(key): Promise<User[]> {
        return fetch(`${API_URL}/issue/${key}/watchers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(process.env.JIRA_AUTH)
            },
        })
            .then((response) => response.json())
            .then((response) => transformUsersResponse(response.watchers))
            .catch((error) => {
                console.error('Error fetching watchers');
                console.error(error);
                return [];
            });
    }

    public getIssueComments(key): Promise<Comment[]> {
        return fetch(`${API_URL}/issue/${key}/comment`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(process.env.JIRA_AUTH)
            },
        })
            .then((response) => response.json())
            .then((response) => transformCommentsResponse(response.comments))
            .catch((error) => {
                console.warn('Error fetching comments');
                console.warn(error);
                return [];
            });
    }
}
