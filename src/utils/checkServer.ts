export async function checkServerRequest(url: string) {
    try {
        await fetch(url);
        return true;
    } catch (err) {
        return false;
    }
}
