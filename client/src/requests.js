class Requests {
    // fetch and return a JSON or PNG
    static async fetchFile(filePath) {
        console.log(`filePath: ${filePath}`)
        let promise;

        // check the file ending
        switch (
        filePath.slice(
            filePath.lastIndexOf('.') + 1
        )) {
            // if the requested file is a JSON
            case 'json':
                promise = fetch(
                    filePath, { method: 'GET' }
                )
                    .then(
                        response => response.json()
                    );
                break;

            // if the requested file is a png
            case 'png':
                promise = fetch(
                    filePath, { method: 'GET' }
                )
                    .then(
                        response => response.blob()
                    )
                    .then(
                        blob => {
                            URL.createObjectURL(blob)
                        0}
                    );
        }

        // return the object returned by promise
        const data = await promise;

        return data;
    }
}

export { Requests }