import fetch from 'node-fetch';

import { ACCESS_TOKEN, API_URL } from '../config/slackConfig.json';

import { Message } from './../model/slack/Message';

export class SlackService {
    public sendMessage(message: Message): Promise<any> {
        const messageBody = {
            token: ACCESS_TOKEN,
            channel: message.channel,
            thread_ts: message.thread,
            text: message.text
        };

        return fetch(`${API_URL}/chat.postMessage`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageBody)
        })
            .then((response) => response.json());
    }
}
