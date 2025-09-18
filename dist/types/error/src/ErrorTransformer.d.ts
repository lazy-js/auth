import { ErrorConstructorMap } from './constants';
import { ErrorInstance } from './Error';
import { ErrorMap as ErrorMapBase, ErrorMapOut as ErrorMapOutBase, ErrorMapInput as ErrorMapInputBase } from './types/transformer';
import { ErrorContextBase } from './types/errors';
export type ErrorMap = ErrorMapBase<ErrorInstance, ErrorConstructorMap>;
export type ErrorMapOut = ErrorMapOutBase<ErrorInstance, ErrorConstructorMap>;
export type ErrorMapInput = ErrorMapInputBase;
type LogLevels = 'unknow' | 'known' | 'all' | 'never';
interface ErrorTransformerOptions {
    messagePropertyName: string;
    log: LogLevels;
}
export declare class ErrorTransformer {
    options?: ErrorTransformerOptions | undefined;
    private errorMap;
    private defaultError;
    private messagePropertyName;
    private log;
    constructor(errorMap: ErrorMap[], defaultError: string | ErrorInstance, options?: ErrorTransformerOptions | undefined);
    transform(err: any, patchedContext: ErrorContextBase): never;
    withAsyncTransform<TArgs extends readonly unknown[], TReturn>(wrappedMethod: (...args: TArgs) => Promise<TReturn>, patchedContext: ErrorContextBase): (...args: TArgs) => Promise<TReturn>;
    withSyncTransform<TArgs extends readonly unknown[], TReturn>(wrappedMethod: (...args: TArgs) => TReturn, patchedContext: ErrorContextBase): (...args: TArgs) => TReturn;
    private msgIncludes;
    private msgMatches;
    private msgEquals;
    private errorInstanceOf;
    private handleInput;
    private handleOutput;
}
export {};
//# sourceMappingURL=ErrorTransformer.d.ts.map