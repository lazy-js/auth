import { getErrorConstructor } from './Error';
const ERROR_TRANSFORMER_ERROR_PREFIX = 'ERROR TRANSFORMER:';
const ERROR_TRANSFORMER_ERROR_POSTFIX = '\n END ERROR TRANSFORMER: \n--------------------------- \n';
export class ErrorTransformer {
    constructor(errorMap, defaultError, options) {
        this.options = options;
        this.errorMap = errorMap;
        this.defaultError = defaultError;
        this.messagePropertyName = (options === null || options === void 0 ? void 0 : options.messagePropertyName) || 'message';
        this.log = (options === null || options === void 0 ? void 0 : options.log) || 'never';
    }
    transform(err, patchedContext) {
        if (typeof this.defaultError !== 'string') {
            this.defaultError.updateContext({
                ...patchedContext,
                originalError: err instanceof Error ? err : new Error(err),
            });
            this.defaultError.updateTimestampToNow();
        }
        let _err = err;
        if (typeof err === 'string') {
            _err = new Error(err);
        }
        if (!_err || !_err[this.messagePropertyName]) {
            throw this.defaultError;
        }
        for (const error of this.errorMap) {
            if (this.handleInput(error.input, _err)) {
                this.handleOutput(error.output, patchedContext, _err);
            }
        }
        if (this.log === 'all' || this.log === 'unknow') {
            if (typeof this.defaultError !== 'string') {
                this.defaultError.log();
            }
        }
        throw this.defaultError;
    }
    withAsyncTransform(wrappedMethod, patchedContext) {
        if (!wrappedMethod) {
            throw new Error('Wrapped method is required');
        }
        return async (...args) => {
            try {
                const result = await wrappedMethod.apply(this, args);
                return result;
            }
            catch (err) {
                throw this.transform(err, patchedContext);
            }
        };
    }
    withSyncTransform(wrappedMethod, patchedContext) {
        if (!wrappedMethod) {
            throw new Error('Wrapped method is required');
        }
        return (...args) => {
            try {
                const fn = wrappedMethod.apply(this, args);
                return fn;
            }
            catch (err) {
                throw this.transform(err, patchedContext);
            }
        };
    }
    msgIncludes(err, ...str) {
        const message = err[this.messagePropertyName].toLowerCase();
        return str.every((s) => message.includes(s.toLowerCase()));
    }
    msgMatches(err, messageRegex) {
        return messageRegex.test(err[this.messagePropertyName]);
    }
    msgEquals(err, message) {
        return err[this.messagePropertyName] === message;
    }
    errorInstanceOf(err, error) {
        return err instanceof error;
    }
    handleInput(input, err) {
        switch (input.condition) {
            case 'includes':
                return this.msgIncludes(err, ...input.messageParts);
            case 'matches':
                return this.msgMatches(err, input.messageRegex);
            case 'equals':
                return this.msgEquals(err, input.message);
            case 'instanceOf':
                return this.errorInstanceOf(err, input.error);
            default:
                return false;
        }
    }
    handleOutput(output, patchedContext, originalError) {
        if (output === 'pass') {
            throw originalError;
        }
        else if (output.type === 'ErrorInstance') {
            let error = output.error;
            const newContext = {
                ...error.context,
                ...patchedContext,
                originalError: originalError instanceof Error ? originalError : new Error(originalError),
            };
            error.updateContext(newContext);
            if (output.replaceConstructor) {
                const Constructor = getErrorConstructor(output.replaceConstructor);
                error = new Constructor({
                    ...error,
                    context: {
                        ...newContext,
                    },
                });
            }
            if (this.log === 'all' || this.log === 'known') {
                error.log();
            }
            throw error;
        }
        else {
            if (this.log === 'all' || this.log === 'known') {
                console.log(ERROR_TRANSFORMER_ERROR_PREFIX);
                console.log(output.code);
                console.log(ERROR_TRANSFORMER_ERROR_POSTFIX);
            }
            throw output.code;
        }
    }
}
//# sourceMappingURL=ErrorTransformer.js.map