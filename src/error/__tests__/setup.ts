import { InternalError, ValidationError } from '../src/Error';
import { ErrorMap, ErrorTransformer } from '../src/ErrorTransformer';

const defaultError = new InternalError({
    code: 'UNKNOWN_ERROR',
    label: 'Unknown error',
});
export const errorMessage = 'Test error';
const errorMap: ErrorMap[] = [
    {
        input: {
            condition: 'equals',
            message: errorMessage,
        },
        output: {
            type: 'ErrorInstance',
            error: new ValidationError({
                code: 'VALIDATION_ERROR',
            }),
        },
    },
];
export const testErrorTransformer = new ErrorTransformer(
    errorMap,
    defaultError,
);
