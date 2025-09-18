import { ErrorConstructorMap } from './constants';
import { ErrorInstance, getErrorConstructor } from './Error';
import {
    ErrorMap as ErrorMapBase,
    ErrorMapOut as ErrorMapOutBase,
    ErrorMapInput as ErrorMapInputBase,
} from './types/transformer';
import { ErrorContextBase } from './types/errors';
import { Constructor } from 'zod/v4/core/util.cjs';

export type ErrorMap = ErrorMapBase<ErrorInstance, ErrorConstructorMap>;
export type ErrorMapOut = ErrorMapOutBase<ErrorInstance, ErrorConstructorMap>;
export type ErrorMapInput = ErrorMapInputBase;
type LogLevels = 'unknow' | 'known' | 'all' | 'never';
interface ErrorTransformerOptions {
    messagePropertyName: string;
    log: LogLevels;
}

const ERROR_TRANSFORMER_ERROR_PREFIX = 'ERROR TRANSFORMER:';
const ERROR_TRANSFORMER_ERROR_POSTFIX =
    '\n END ERROR TRANSFORMER: \n--------------------------- \n';

export class ErrorTransformer {
    private errorMap: ErrorMap[];
    private defaultError: string | ErrorInstance;
    private messagePropertyName: string;
    private log: LogLevels;
    constructor(
        errorMap: ErrorMap[],
        defaultError: string | ErrorInstance,
        public options?: ErrorTransformerOptions,
    ) {
        this.errorMap = errorMap;
        this.defaultError = defaultError;
        this.messagePropertyName = options?.messagePropertyName || 'message';
        this.log = options?.log || 'never';
    }

    transform(err: any, patchedContext: ErrorContextBase): never {
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
    withAsyncTransform<TArgs extends readonly unknown[], TReturn>(
        wrappedMethod: (...args: TArgs) => Promise<TReturn>,
        patchedContext: ErrorContextBase,
    ): (...args: TArgs) => Promise<TReturn> {
        if (!wrappedMethod) {
            throw new Error('Wrapped method is required');
        }
        return async (...args: TArgs) => {
            try {
                const result = await wrappedMethod.apply(this, args as any);
                return result;
            } catch (err: any) {
                throw this.transform(err, patchedContext);
            }
        };
    }

    withSyncTransform<TArgs extends readonly unknown[], TReturn>(
        wrappedMethod: (...args: TArgs) => TReturn,
        patchedContext: ErrorContextBase,
    ): (...args: TArgs) => TReturn {
        if (!wrappedMethod) {
            throw new Error('Wrapped method is required');
        }
        return (...args: TArgs) => {
            try {
                const fn = wrappedMethod.apply(this, args as any);
                return fn as TReturn;
            } catch (err: any) {
                throw this.transform(err, patchedContext);
            }
        };
    }

    private msgIncludes(err: any, ...str: string[]) {
        const message = err[this.messagePropertyName].toLowerCase();
        return str.every((s) => message.includes(s.toLowerCase()));
    }

    private msgMatches(err: any, messageRegex: RegExp) {
        return messageRegex.test(err[this.messagePropertyName]);
    }

    private msgEquals(err: any, message: string) {
        return err[this.messagePropertyName] === message;
    }

    private errorInstanceOf(err: any, error: Constructor<any>) {
        return err instanceof error;
    }

    private handleInput(input: ErrorMapInput, err: any) {
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

    private handleOutput(
        output: ErrorMapOut,
        patchedContext: ErrorContextBase,
        originalError: any,
    ): never {
        if (output === 'pass') {
            throw originalError;
        } else if (output.type === 'ErrorInstance') {
            let error = output.error;
            const newContext = {
                ...error.context,
                ...patchedContext,
                originalError:
                    originalError instanceof Error
                        ? originalError
                        : new Error(originalError),
            };
            error.updateContext(newContext);
            if (output.replaceConstructor) {
                const Constructor = getErrorConstructor(
                    output.replaceConstructor,
                );
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
        } else {
            if (this.log === 'all' || this.log === 'known') {
                console.log(ERROR_TRANSFORMER_ERROR_PREFIX);
                console.log(output.code);
                console.log(ERROR_TRANSFORMER_ERROR_POSTFIX);
            }
            throw output.code;
        }
    }
}
