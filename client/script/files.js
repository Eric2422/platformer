class Files {
    // read the JSON at a relative filePath
    // return the JSON as JS object
    static async readJSON(filePath) {
        // get the the file
        // and return the JSON as an object
        const promise = fetch(
            filePath, { method: 'GET' }
        )
            .then((response) => response.json());

        // return the object returned by promise
        const JSONObject = await promise;
        return JSONObject;
    }
}

export { Files }