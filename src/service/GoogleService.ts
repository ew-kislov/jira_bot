const { google } = require('googleapis');

import { configureGoogle } from '../config/googleConfig';

import { UserMapping } from './../model/app/UserMapping';

export class GoogleService {
    private authClient: any;
    private sheets: any;

    constructor() {
        this.init();
    }

    public async init() {
        this.authClient = await configureGoogle();
        this.sheets = google.sheets({ version: 'v4', auth: this.authClient });
    }

    public getUserMappings(): Promise<UserMapping[]> {
        return new Promise((resolve, reject) => {
            this.sheets.spreadsheets.values.get({
                spreadsheetId: '1cegynjYi6Fvy_ZqX1WCE4e6G1_Xn43OI1xxAzYu0_z8',
                range: `'Bot'!A:B`,
            }, (err, res) => {
                if (err) {
                    return reject(err);
                } else {
                    const userMappingsRaw: any[] = res.data.values;
                    userMappingsRaw.shift();

                    const userMappings: UserMapping[] = userMappingsRaw.map((userMappingRaw) => ({
                        jiraKey: userMappingRaw[0],
                        slackId: userMappingRaw[1]
                    }));

                    return resolve(userMappings);
                }
            });
        });
    }
}
