class CookieHandler {
    /**
     * Set the cookie to store the last time that the user visited this website
     * 
     * @param {String} cookieData 
     */
    static setCoookie(cookieData) {
        document.cookie = `lastVisited: ${Date.now()}`;
    }

    /**
     * Prints out the cookie stored
     */
    static logCookie() {
        console.log(document.cookie);
    }
}

export { CookieHandler };