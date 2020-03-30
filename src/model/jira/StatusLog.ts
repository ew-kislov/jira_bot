export interface StatusLog {
    logDate: Date;
    previousStatus: string;
    currentStatus: string;
}

export function transformStatusLogsResponse(statusLogsRaw: any[]): StatusLog[] {
    const statusLogs: StatusLog[] = [];

    for (const statusLogRaw of statusLogsRaw) {
        for (const item of statusLogRaw.items) {
            if (item.field == 'status') {
                statusLogs.push({
                    logDate: new Date(statusLogRaw.created),
                    previousStatus: item.fromString,
                    currentStatus: item.toString
                });
            }
        }
    }

    return statusLogs;
}
