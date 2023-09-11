class CookieHandler {
    static setCoookie(cookieData) {
        document.cookie = `lastVisited: ${Date.now()}`;
    }

    static logCookie() {
        console.log(document.cookie);
    }
}

export { CookieHandler };