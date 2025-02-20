export default function pingWebSocket(url) {
    return new Promise((resolve, reject) => {
        const testSock = new WebSocket(url);
        testSock.onopen = () => {
            let startTime = performance.now();
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