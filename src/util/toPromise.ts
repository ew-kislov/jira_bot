export function toPromise(func, param) {
    return new Promise((resolve, reject) => {
        func(param, (err, data) => err ? reject(err) : resolve(JSON.parse(data)));
    });
}
