export function removeWorkingDirectoryFromStack(stack: string): string {
        return stack.replace(process.cwd(), "");
}

export function cleanStack(stack: string, ...linesToExclude: string[]): string {
        return stack
                .split("\n")
                .filter((line) => !linesToExclude.some((lineToExclude) => line.includes(lineToExclude)))
                .join("\n");
}

export function generateStack({
        clean,
        removeWorkingDirectoryPrefix,
        errorName,
}: {
        clean?: string[];
        removeWorkingDirectoryPrefix?: boolean;
        errorName?: string;
}): string | undefined {
        let stack: string | undefined = undefined;
        const error = new Error();
        // replace the stack string which starts with "Error" with the error name

        stack = error.stack;
        if (errorName) {
                stack = stack?.replace(/^Error: \n /, `${errorName}: \n `);
        }
        if (removeWorkingDirectoryPrefix) {
                stack = removeWorkingDirectoryFromStack(stack ?? "");
        }
        return clean && clean.length > 0 ? cleanStack(stack ?? "", ...clean) : stack;
}
