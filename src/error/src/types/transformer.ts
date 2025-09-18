type ErrorMapCondition =
        | "default"
        | "includes"
        | "startsWith"
        | "endsWith"
        | "equals"
        | "notEquals"
        | "contains"
        | "notContains"
        | "matches"
        | "notMatches"
        | "instanceOf";

type ErrorMapBase = {
        condition: ErrorMapCondition;
};

interface ErrorMapIncludes extends ErrorMapBase {
        condition: "includes";
        messageParts: string[];
}
interface ErrorMapMatches extends ErrorMapBase {
        condition: "matches";
        messageRegex: RegExp;
}

interface ErrorMapEquals extends ErrorMapBase {
        condition: "equals";
        message: string;
}
interface ErrorMapDefault extends ErrorMapBase {
        condition: "default";
}

export type Constructor<T = {}> = new (...args: any[]) => T;

interface ErrorMapInstanceOf extends ErrorMapBase {
        condition: "instanceOf";
        error: Constructor;
}

interface ErrorMapOutBase {
        type: "ErrorInstance" | "String";
}

export interface ErrorMapIfOutErrorInstance<T, C> extends ErrorMapOutBase {
        type: "ErrorInstance";
        error: T;
        replaceConstructor?: C;
}

interface ErrorMapIfOutString extends ErrorMapOutBase {
        type: "String";
        code: string;
}
export type ErrorMapInput = ErrorMapIncludes | ErrorMapMatches | ErrorMapEquals | ErrorMapDefault | ErrorMapInstanceOf;
export type ErrorMapOut<T, C> = "pass" | ErrorMapIfOutErrorInstance<T, C> | ErrorMapIfOutString;

/**
 * @description ErrorMap is a type that represents a mapping of an input to an output
 * @description T is enum of error constructors
 * @description C is the type of the constructor
 */
export type ErrorMap<T, C> = { input: ErrorMapInput; output: ErrorMapOut<T, C> };
