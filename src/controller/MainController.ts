import scheduler from 'node-schedule';

import { ISSUE_URL } from '../config/jiraConfig.json';

import { SlackService } from '../service/SlackService';
import { GoogleService } from './../service/GoogleService';
import { JiraService } from './../service/JiraService';

import { UserMapping } from './../model/app/UserMapping';

import { dateHourDifference } from '../util/date';

export class MainController {

    private slackService: SlackService;
    private jiraService: JiraService;
    private googleService: GoogleService;

    constructor() {
        this.slackService = new SlackService();
        this.jiraService = new JiraService();
        this.googleService = new GoogleService();
    }

    public configureJiraNotifier() {
        scheduler.scheduleJob({ minute: 0, second: 0 }, async () => {
            const issues = await this.jiraService.getIssues();

            const userMappings: UserMapping[] = await this.googleService.getUserMappings();

            const currentDate = new Date();

            for (const issue of issues) {
                // checking status changes

                for (const statusLog of issue.statusLogs) {
                    if (dateHourDifference(currentDate, statusLog.logDate) <= 1) {
                        // TODO get watchers with mapping and send them

                        for (const watcher of issue.watchers) {
                            const watcherMapping = userMappings.find((userMapping) => userMapping.jiraKey == watcher.key);
                            if (watcherMapping) {
                                await this.slackService.sendMessage({
                                    text: `<${ISSUE_URL}/${issue.key} | ${issue.key} ${issue.name}> перешла из статуса *${statusLog.previousStatus}* в *${statusLog.currentStatus}*`,
                                    channel: watcherMapping.slackId
                                });
                            }
                        }
                    }
                }

                // checking comments

                for (const comment of issue.comments) {
                    if (dateHourDifference(currentDate, comment.creationDate) <= 1) {
                        if (comment.text.substr(0, 2) == '[~') {
                            // sending notifications to notified in comment

                            const targetJiraKey = comment.text.substring(2, comment.text.indexOf(']'));
                            const targetMapping = userMappings.find((userMapping) => userMapping.jiraKey == targetJiraKey);

                            if (targetMapping) {
                                let message = comment.text.substring(comment.text.indexOf(']') + 1);
                                if (message[0] == ',' || message[0] == '\n') {
                                    message = message.substring(1);
                                }
                                message = message.trim();

                                await this.slackService.sendMessage({
                                    text: `<${ISSUE_URL}/${issue.key} | ${issue.key} ${issue.name}> *${comment.author.name}* сообщает тебе: "${message}"`,
                                    channel: targetMapping.slackId
                                });
                            }
                        }
                        // else {
                        //     // sending notifications to watchers

                        //     for (const watcher of issue.watchers) {
                        //         const watcherMapping = userMappings.find((userMapping) => userMapping.jiraKey == watcher.key);
                        //         if (watcherMapping) {
                        //             await this.slackService.sendMessage({
                        //                 text: `<${ISSUE_URL}/${issue.key} | ${issue.key} ${issue.name}> *${comment.author.name}* прокомментировал(а): "${comment.text}"`,
                        //                 channel: watcherMapping.slackId
                        //             });
                        //         }
                        //     }
                        // }
                    }
                }
            }
        });
    }
}
