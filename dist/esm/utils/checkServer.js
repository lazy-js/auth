export async function checkServerRequest(url) {
    try {
        await fetch(url);
        return true;
    }
    catch (err) {
        return false;
    }
}
//# sourceMappingURL=checkServer.js.map