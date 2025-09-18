import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ErrorTransformer, ErrorMap } from '../src/ErrorTransformer';
import {
    ValidationError,
    ConflictError,
    ExternalServiceError,
    NotFoundError,
    InternalError,
    NetworkError,
} from '../src/Error';
import { ErrorLayer, ErrorConstructorMap } from '../src/constants';

const defaultError = new InternalError({
    code: 'UNKNOWN_ERROR',
    label: 'Unknown error',
});

describe('ErrorTransformer', () => {
    let errorTransformer: ErrorTransformer;
    let mockErrorMap: ErrorMap[];

    beforeEach(() => {
        // Reset error map for each test
        mockErrorMap = [];
        errorTransformer = new ErrorTransformer(mockErrorMap, defaultError);
    });

    describe('Constructor', () => {
        it('should initialize with empty error map', () => {
            const transformer = new ErrorTransformer([], defaultError);
            expect(transformer).toBeInstanceOf(ErrorTransformer);
        });

        it('should initialize with provided error map', () => {
            const errorMap: ErrorMap[] = [
                {
                    input: {
                        condition: 'equals',
                        message: 'Test error',
                    },
                    output: {
                        type: 'String',
                        code: 'TEST_ERROR',
                    },
                },
            ];

            const transformer = new ErrorTransformer(errorMap, defaultError);
            expect(transformer).toBeInstanceOf(ErrorTransformer);
        });
    });

    describe('Error Input Matching', () => {
        describe('includes condition', () => {
            beforeEach(() => {
                mockErrorMap = [
                    {
                        input: {
                            condition: 'includes',
                            messageParts: ['sibling group', 'already exists'],
                        },
                        output: {
                            type: 'String',
                            code: 'SUB_GROUP_ALREADY_EXISTS',
                        },
                    },
                ];
                errorTransformer = new ErrorTransformer(
                    mockErrorMap,
                    defaultError,
                );
            });

            it('should match error message containing all required parts', () => {
                const error = new Error('sibling group already exists');

                expect(() => {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                }).toThrow('SUB_GROUP_ALREADY_EXISTS');
            });

            it('should match error message with different case', () => {
                const error = new Error('SIBLING GROUP ALREADY EXISTS');

                expect(() => {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                }).toThrow('SUB_GROUP_ALREADY_EXISTS');
            });

            it('should not match error message missing required parts', () => {
                const error = new Error('group already exists');

                expect(() => {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                }).toThrow(InternalError);
            });

            it('should not match error message with partial match', () => {
                const error = new Error('sibling group');

                expect(() => {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                }).toThrow(InternalError);
            });
        });

        describe('equals condition', () => {
            beforeEach(() => {
                mockErrorMap = [
                    {
                        input: {
                            condition: 'equals',
                            message: 'Validation error',
                        },
                        output: {
                            type: 'String',
                            code: 'VALIDATION_ERROR',
                        },
                    },
                ];
                errorTransformer = new ErrorTransformer(
                    mockErrorMap,
                    defaultError,
                );
            });

            it('should match exact error message', () => {
                const error = new Error('Validation error');

                expect(() => {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                }).toThrow('VALIDATION_ERROR');
            });

            it('should not match similar error message', () => {
                const error = new Error('validation error');

                expect(() => {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                }).toThrow(InternalError);
            });

            it('should not match error message with extra text', () => {
                const error = new Error('Validation error occurred');

                expect(() => {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                }).toThrow(InternalError);
            });
        });

        describe('matches condition', () => {
            beforeEach(() => {
                mockErrorMap = [
                    {
                        input: {
                            condition: 'matches',
                            messageRegex: /^User \d+ not found$/,
                        },
                        output: {
                            type: 'String',
                            code: 'USER_NOT_FOUND',
                        },
                    },
                ];
                errorTransformer = new ErrorTransformer(
                    mockErrorMap,
                    defaultError,
                );
            });

            it('should match error message with regex', () => {
                const error = new Error('User 123 not found');

                expect(() => {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                }).toThrow('USER_NOT_FOUND');
            });

            it("should not match error message that doesn't match regex", () => {
                const error = new Error('User not found');

                expect(() => {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                }).toThrow(InternalError);
            });
        });
    });

    describe('Error Output Handling', () => {
        describe('String output type', () => {
            beforeEach(() => {
                mockErrorMap = [
                    {
                        input: {
                            condition: 'equals',
                            message: 'Test error',
                        },
                        output: {
                            type: 'String',
                            code: 'TEST_ERROR_CODE',
                        },
                    },
                ];
                errorTransformer = new ErrorTransformer(
                    mockErrorMap,
                    defaultError,
                );
            });

            it('should throw string code when matched', () => {
                const error = new Error('Test error');

                expect(() => {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                }).toThrow('TEST_ERROR_CODE');
            });
        });

        describe('ErrorInstance output type', () => {
            beforeEach(() => {
                const validationError = new ValidationError({
                    code: 'VALIDATION_ERROR',
                    label: 'Validation failed',
                    context: {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                        providedValueType: 'string',
                        providedValue: 'invalid',
                        expectedValueType: 'number',
                        expectedValueExample: 123,
                        path: 'user.age',
                        constraint: 'type',
                    },
                });

                mockErrorMap = [
                    {
                        input: {
                            condition: 'equals',
                            message: 'Validation error',
                        },
                        output: {
                            type: 'ErrorInstance',
                            error: validationError,
                        },
                    },
                ];
                errorTransformer = new ErrorTransformer(
                    mockErrorMap,
                    defaultError,
                );
            });

            it('should throw ErrorInstance when matched', () => {
                const error = new Error('Validation error');

                expect(() => {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                }).toThrow(ValidationError);
            });

            it('should preserve error instance properties', () => {
                const error = new Error('Validation error');

                try {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                } catch (thrownError) {
                    expect(thrownError).toBeInstanceOf(ValidationError);
                    expect((thrownError as ValidationError).code).toBe(
                        'VALIDATION_ERROR',
                    );
                    expect((thrownError as ValidationError).label).toBe(
                        'Validation failed',
                    );
                }
            });
        });

        describe('ErrorInstance with replaceConstructor', () => {
            beforeEach(() => {
                const conflictError = new ConflictError({
                    code: 'CONFLICT_ERROR',
                    label: 'Resource conflict',
                });

                mockErrorMap = [
                    {
                        input: {
                            condition: 'equals',
                            message: 'Conflict error',
                        },
                        output: {
                            type: 'ErrorInstance',
                            error: conflictError,
                            replaceConstructor:
                                ErrorConstructorMap.NotFoundError,
                        },
                    },
                ];
                errorTransformer = new ErrorTransformer(
                    mockErrorMap,
                    defaultError,
                );
            });

            it('should replace error constructor when specified', () => {
                const error = new Error('Conflict error');

                expect(() => {
                    errorTransformer.transform(error, {
                        layer: ErrorLayer.APP,
                        className: 'TestClass',
                        methodName: 'testMethod',
                    });
                }).toThrow(NotFoundError);
            });

            it('should merge context when replacing constructor', () => {
                const error = new Error('Conflict error');
                const context = {
                    layer: ErrorLayer.SERVICE,
                    className: 'UserService',
                    methodName: 'createUser',
                };

                try {
                    errorTransformer.transform(error, context);
                } catch (thrownError) {
                    expect(thrownError).toBeInstanceOf(NotFoundError);
                    expect(
                        (thrownError as NotFoundError).context,
                    ).toMatchObject(context);
                }
            });
        });
    });

    describe('Multiple Error Maps', () => {
        beforeEach(() => {
            mockErrorMap = [
                {
                    input: {
                        condition: 'includes',
                        messageParts: ['sibling group', 'already exists'],
                    },
                    output: {
                        type: 'String',
                        code: 'SUB_GROUP_ALREADY_EXISTS',
                    },
                },
                {
                    input: {
                        condition: 'equals',
                        message: 'Validation error',
                    },
                    output: {
                        type: 'String',
                        code: 'VALIDATION_ERROR',
                    },
                },
                {
                    input: {
                        condition: 'matches',
                        messageRegex: /^User \d+ not found$/,
                    },
                    output: {
                        type: 'String',
                        code: 'USER_NOT_FOUND',
                    },
                },
            ];
            errorTransformer = new ErrorTransformer(mockErrorMap, defaultError);
        });

        it('should match first applicable error map', () => {
            const error = new Error('sibling group already exists');

            expect(() => {
                errorTransformer.transform(error, {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                });
            }).toThrow('SUB_GROUP_ALREADY_EXISTS');
        });

        it("should match second error map when first doesn't match", () => {
            const error = new Error('Validation error');

            expect(() => {
                errorTransformer.transform(error, {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                });
            }).toThrow('VALIDATION_ERROR');
        });

        it("should match third error map when first two don't match", () => {
            const error = new Error('User 123 not found');

            expect(() => {
                errorTransformer.transform(error, {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                });
            }).toThrow('USER_NOT_FOUND');
        });
    });

    describe('No Matching Error Map', () => {
        beforeEach(() => {
            mockErrorMap = [
                {
                    input: {
                        condition: 'equals',
                        message: 'Specific error',
                    },
                    output: {
                        type: 'String',
                        code: 'SPECIFIC_ERROR',
                    },
                },
            ];
            errorTransformer = new ErrorTransformer(mockErrorMap, defaultError);
        });

        it('should throw InternalError when no error map matches', () => {
            const error = new Error('Unknown error');

            expect(() => {
                errorTransformer.transform(error, {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                });
            }).toThrow(InternalError);
        });

        it('should include original error in context when no match', () => {
            const error = new Error('Unknown error');
            const context = {
                layer: ErrorLayer.APP,
                className: 'TestClass',
                methodName: 'testMethod',
            };

            try {
                errorTransformer.transform(error, context);
            } catch (thrownError) {
                expect(thrownError).toBeInstanceOf(InternalError);
                expect((thrownError as InternalError).code).toBe(
                    defaultError.code,
                );
                expect((thrownError as InternalError).context).toMatchObject(
                    context,
                );
                expect(
                    (thrownError as InternalError).context?.originalError,
                ).toBeDefined();
            }
        });
    });

    describe('Context Handling', () => {
        beforeEach(() => {
            const validationError = new ValidationError({
                code: 'VALIDATION_ERROR',
                label: 'Validation failed',
                context: {
                    layer: ErrorLayer.APP,
                    className: 'OriginalClass',
                    methodName: 'originalMethod',
                },
            });

            mockErrorMap = [
                {
                    input: {
                        condition: 'equals',
                        message: 'Validation error',
                    },
                    output: {
                        type: 'ErrorInstance',
                        error: validationError,
                        replaceConstructor: ErrorConstructorMap.ValidationError,
                    },
                },
            ];
            errorTransformer = new ErrorTransformer(mockErrorMap, defaultError);
        });

        it('should merge provided context with error context', () => {
            const error = new Error('Validation error');
            const newContext = {
                layer: ErrorLayer.SERVICE,
                className: 'UserService',
                methodName: 'validateUser',
                userId: '123',
            };

            try {
                errorTransformer.transform(error, newContext);
            } catch (thrownError) {
                expect((thrownError as ValidationError).context).toMatchObject({
                    ...newContext,
                });
            }
        });
    });

    describe('withAsyncTransform', () => {
        beforeEach(() => {
            mockErrorMap = [
                {
                    input: {
                        condition: 'equals',
                        message: 'Async error',
                    },
                    output: {
                        type: 'String',
                        code: 'ASYNC_ERROR',
                    },
                },
            ];
            errorTransformer = new ErrorTransformer(mockErrorMap, defaultError);
        });

        it('should transform async function errors', async () => {
            const asyncFunction = vi
                .fn()
                .mockRejectedValue(new Error('Async error'));
            const wrappedFunction = errorTransformer.withAsyncTransform(
                asyncFunction,
                {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                },
            );

            await expect(wrappedFunction()).rejects.toThrow('ASYNC_ERROR');
        });

        it('should not transform non-Error objects', async () => {
            const asyncFunction = vi.fn().mockRejectedValue('String error');
            const wrappedFunction = errorTransformer.withAsyncTransform(
                asyncFunction,
                {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                },
            );

            await expect(wrappedFunction()).rejects.toThrow(InternalError);
        });

        it('should pass through successful async function results', async () => {
            const asyncFunction = vi.fn().mockResolvedValue('Success');
            const wrappedFunction = errorTransformer.withAsyncTransform(
                asyncFunction,
                {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                },
            );

            const result = await wrappedFunction();
            expect(result).toBe('Success');
        });

        it('should pass through successful sync function results', () => {
            const syncFunction = vi.fn().mockReturnValue('Success');
            const wrappedFunction = errorTransformer.withSyncTransform(
                syncFunction,
                {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                },
            );

            const result = wrappedFunction();
            expect(result).toBe('Success');
        });
    });

    describe('Edge Cases', () => {
        beforeEach(() => {
            mockErrorMap = [
                {
                    input: {
                        condition: 'equals',
                        message: 'Test error',
                    },
                    output: {
                        type: 'String',
                        code: 'TEST_ERROR',
                    },
                },
            ];
            errorTransformer = new ErrorTransformer(mockErrorMap, defaultError);
        });

        it('should handle error without message property', () => {
            const error = { name: 'Error', stack: 'stack trace' };

            expect(() => {
                errorTransformer.transform(error, {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                });
            }).toThrow(InternalError);
        });

        it('should handle null error', () => {
            expect(() => {
                errorTransformer.transform(null, {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                });
            }).toThrow(InternalError);
        });

        it('should handle undefined error', () => {
            expect(() => {
                errorTransformer.transform(undefined, {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                });
            }).toThrow(InternalError);
        });

        it('should handle string error', () => {
            expect(() => {
                errorTransformer.transform('String error', {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                });
            }).toThrow(InternalError);
        });

        it('should handle empty error map', () => {
            const emptyTransformer = new ErrorTransformer([], defaultError);
            const error = new Error('Any error');

            expect(() => {
                emptyTransformer.transform(error, {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                });
            }).toThrow(InternalError);
        });
    });

    describe('Complex Error Scenarios', () => {
        beforeEach(() => {
            const externalServiceError = new ExternalServiceError({
                code: 'KEYCLOAK_ERROR',
                label: 'Keycloak service error',
                externalService: 'Keycloak',
            });

            mockErrorMap = [
                {
                    input: {
                        condition: 'includes',
                        messageParts: ['Keycloak', 'connection'],
                    },
                    output: {
                        type: 'ErrorInstance',
                        error: externalServiceError,
                        replaceConstructor: ErrorConstructorMap.NetworkError,
                    },
                },
                {
                    input: {
                        condition: 'matches',
                        messageRegex: /^HTTP \d{3}:/,
                    },
                    output: {
                        type: 'String',
                        code: 'HTTP_ERROR',
                    },
                },
            ];
            errorTransformer = new ErrorTransformer(mockErrorMap, defaultError);
        });

        it('should handle complex error transformation with constructor replacement', () => {
            const error = new Error('Keycloak connection failed');

            expect(() => {
                errorTransformer.transform(error, {
                    layer: ErrorLayer.SERVICE,
                    className: 'KeycloakService',
                    methodName: 'connect',
                });
            }).toThrow(NetworkError);
        });

        it('should handle HTTP error pattern matching', () => {
            const error = new Error('HTTP 404: Not Found');

            expect(() => {
                errorTransformer.transform(error, {
                    layer: ErrorLayer.APP,
                    className: 'TestClass',
                    methodName: 'testMethod',
                });
            }).toThrow('HTTP_ERROR');
        });

        it('should preserve external service information when transforming', () => {
            const error = new Error('Keycloak connection failed');

            try {
                errorTransformer.transform(error, {
                    layer: ErrorLayer.SERVICE,
                    className: 'KeycloakService',
                    methodName: 'connect',
                });
            } catch (thrownError) {
                expect(thrownError).toBeInstanceOf(NetworkError);
                // The external service info should be preserved from the original error
                expect((thrownError as NetworkError).context).toMatchObject({
                    layer: ErrorLayer.SERVICE,
                    className: 'KeycloakService',
                    methodName: 'connect',
                });
            }
        });
    });
});
