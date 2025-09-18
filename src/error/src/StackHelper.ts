const colors = {
    // Reset and styling
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    italic: '\x1b[3m',
    underline: '\x1b[4m',
    strikethrough: '\x1b[9m',

    // Modern semantic colors (using 256-color palette)
    primary: '\x1b[38;5;33m', // Bright blue
    secondary: '\x1b[38;5;141m', // Purple
    success: '\x1b[38;5;46m', // Bright green
    warning: '\x1b[38;5;214m', // Orange
    error: '\x1b[38;5;196m', // Bright red
    info: '\x1b[38;5;51m', // Cyan
    muted: '\x1b[38;5;244m', // Gray
    accent: '\x1b[38;5;208m', // Orange accent
};
interface CallStack {
    functionName: string;
    filePath: string;
    lineNumber: string;
    columnNumber: string;
    fullFileRef: string;
}

/**
 * StackHelper class
 * This class is used to get and filter the call stack
 *
 */
class StackHelper {
    static createStack(errorName: string, errorMessage: string): string {
        const errorStack = new Error(errorMessage).stack || '';
        return errorStack.replace('Error: ', `${errorName}: `);
    }

    static getCallStack(_stack: string | Error): CallStack[] {
        let stack =
            _stack instanceof Error
                ? _stack.stack || ''
                : _stack || new Error().stack || '';
        let lines = stack.split('\n');
        // remove the first line which is the error message
        lines.shift();
        // remove the line which is the getCallStack function
        lines = lines.filter(
            (line) =>
                !line.includes('at getCallStack') &&
                !line.includes('createStack'),
        );
        // map the lines to the CallStack interface
        const callStack: CallStack[] = lines.map((line) => {
            let [functionName, fullFileRef] = line
                .replace('at ', '')
                .trim()
                .split('(');
            if (!fullFileRef) {
                fullFileRef = functionName;
                functionName = 'anonymous';
            }
            const { filePath, lineNumber, columnNumber } =
                StackHelper._parseFullFileRef(fullFileRef);
            return {
                functionName,
                filePath,
                lineNumber,
                columnNumber,
                fullFileRef,
            };
        });
        return callStack;
    }

    static _parseFullFileRef(fullFileRef: string): {
        filePath: string;
        lineNumber: string;
        columnNumber: string;
    } {
        const [driveLetter, filePath, lineNumber, columnNumber] = fullFileRef
            .replace(')', '')
            .trim()
            .split(':');
        return {
            filePath: driveLetter + ':' + filePath,
            lineNumber,
            columnNumber,
        };
    }
    static getAndFilterCallStack(
        _stack: string | Error,
        keywords: string[],
    ): CallStack[] {
        return StackHelper.getCallStack(_stack).filter(
            (callSite) =>
                !keywords.some((keyword) =>
                    callSite.fullFileRef.includes(keyword),
                ),
        );
    }

    static _formatFunctionName(functionName: string): string {
        if (functionName === 'anonymous') {
            return functionName;
        }
        if (functionName.includes('.')) {
            return functionName.replace('.', ' #');
        }
        return functionName;
    }
    static formatCallStackLine(callSite: CallStack, index: number = 0): string {
        const isCurrentFrame = index === 0;
        const frameColor = colors.warning;
        const lineColor = colors.warning;
        const functionColor = colors.warning;
        const frameIndicator = isCurrentFrame
            ? '|--> inside'
            : `|--> parent ${index}`;

        const functionName = StackHelper._formatFunctionName(
            callSite.functionName,
        );
        return (
            `       ${frameColor}${frameIndicator} ${callSite.fullFileRef}${colors.reset} #${functionName}${colors.reset} \n` +
            `       |` +
            `    ${lineColor} Line:${colors.reset} ${colors.dim}${callSite.lineNumber}${colors.reset}` +
            `${functionColor} Function:${colors.reset} ${colors.dim}${functionName}()${colors.reset}` +
            '\n'
        );
    }

    static concatErrorStacks(
        _source: string | Error,
        _target: string | Error,
    ): string {
        const source = StackHelper.getCallStack(_source);
        const target = StackHelper.getCallStack(_target);
        return source.concat(target).join('\n');
    }

    static logCallStack(callStack: CallStack[]): void {
        callStack.forEach((callSite, index) => {
            console.log(`${StackHelper.formatCallStackLine(callSite, index)}`);
        });
    }

    static logStack(_stack: string | Error): void {
        const callStack = StackHelper.getCallStack(_stack);
        StackHelper.logCallStack(callStack);
    }
    static logErrorName(errorName: string, errorMessage: string): void {
        console.log(
            `${colors.error}${errorName}${colors.reset}: ${errorMessage}`,
        );
    }

    static logFunctionsStack(callStack: CallStack[]): void {
        const names = callStack.map((callSite) => callSite.functionName);
        console.log(names.reverse().join(' --> '));
    }

    static singleLineSeparator(
        text: string = '',
        color: string = colors.warning,
    ): void {
        console.log(
            color + `-----------------${text}-----------------` + colors.reset,
        );
    }

    static doubleLineSeparator(
        text: string = '',
        color: string = colors.warning,
    ): void {
        console.log(
            color + `================${text}================` + colors.reset,
        );
    }

    static warningConsole(message: string): void {
        console.log(colors.warning + message + colors.reset);
    }
}

export { StackHelper };
