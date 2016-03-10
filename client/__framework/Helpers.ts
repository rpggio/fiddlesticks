
function logtap<T>(message: string, stream: Rx.Observable<T>): Rx.Observable<T>{
    return stream.tap(t => console.log(message, t));
}

function newid(): string {
    return (new Date().getTime()+Math.random()).toString(36);
}
