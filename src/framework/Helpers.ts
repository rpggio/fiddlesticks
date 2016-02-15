
function newid(): string {
    return (new Date().getTime()+Math.random()).toString(36);
}
