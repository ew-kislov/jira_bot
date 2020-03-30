import bodyParser from 'body-parser';
import express from 'express';

import { APP_PORT } from './config/appConfig.json';

import { MainController } from './controller/MainController';

export class App {
    private expressApp: express.Application;

    private controller: MainController;

    constructor() {
        // initializing controllers

        this.controller = new MainController();

        // setting up express

        this.expressApp = express();
        this.useExpressMiddleware();
        this.setRoutes();

        this.expressApp.listen(APP_PORT, () => console.warn(`Started listening on ${APP_PORT}`));

        // testing jira

        this.controller.configureJiraNotifier();
    }

    private useExpressMiddleware() {
        const rawBodyBuffer = (req, res, buf, encoding) => {
            if (buf && buf.length) {
                req.rawBody = buf.toString(encoding || 'utf8');
            }
        };

        this.expressApp.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
        this.expressApp.use(bodyParser.json({ verify: rawBodyBuffer }));
    }

    private setRoutes() {
        // TODO
    }
}
