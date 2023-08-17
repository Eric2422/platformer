class Requests {
    // fetch a JSON and parse it
    static async fetchJSON(filePath) {
        const promise = fetch(
            filePath, { method: 'GET' }
        )
            .then(
                response => response.json()
            );

        return await promise;
    }
}

export { Requests }