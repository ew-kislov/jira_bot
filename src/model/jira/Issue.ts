import { User } from './../jira/User';
import { Comment } from './Comment';
import { StatusLog } from './StatusLog';

export interface Issue {
    key: string;
    name: string;
    statusLogs: StatusLog[];
    watchers: User[];
    comments: Comment[];
}
