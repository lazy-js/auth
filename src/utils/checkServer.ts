export async function checkServerRequest(url: string) {
    try {
        const res = await fetch(url);
        return true;
    } catch (err) {
        return false;
    }
}
