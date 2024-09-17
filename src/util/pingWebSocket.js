export default function pingWebSocket(url) {
    let startTime = performance.now();

    return new Promise((resolve, reject) => {
        const testSock = new WebSocket(url);
        testSock.onopen = () => {
            testSock.send('{"event": "ping"}');
            testSock.onmessage = () => {
                testSock.close();
                resolve(performance.now() - startTime);
            };
            testSock.onerror = (error) => {
                testSock.close();
                reject(error);
            };
        };

        testSock.onerror = (error) => {
            reject(error);
        };
    })
}