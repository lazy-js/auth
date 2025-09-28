"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkServerRequest = checkServerRequest;
async function checkServerRequest(url) {
    try {
        await fetch(url);
        return true;
    }
    catch (err) {
        return false;
    }
}
//# sourceMappingURL=checkServer.js.map