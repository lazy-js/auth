import { describe, it, expect } from "vitest";
import { ErrorTransformer } from "../src/ErrorTransformer";
import { InternalError, ValidationError } from "../src/Error";
import { errorMessage, testErrorTransformer } from "./setup";

class TestClass {
        public name: string;
        constructor(private errorTransformer: ErrorTransformer) {
                this.name = "TestClass";
        }

        rejectAsync = this.errorTransformer.withAsyncTransform(
                async (): Promise<string> => {
                        throw new Error(errorMessage);
                },
                { methodName: "rejectAsync" }
        );

        resolveAsync = this.errorTransformer.withAsyncTransform(
                async (): Promise<string> => {
                        return await Promise.resolve(this.name);
                },
                { methodName: "resolveAsync" }
        );

        rejectSync = this.errorTransformer.withSyncTransform(
                (): string => {
                        throw new Error(errorMessage);
                },
                { methodName: "rejectSync" }
        );

        resolveSync = this.errorTransformer.withSyncTransform(
                (): string => {
                        return this.name;
                },
                { methodName: "resolveSync" }
        );
}

const testClass = new TestClass(testErrorTransformer);

describe("ErrorTransformer using manual wrapper", () => {
        it("should transform async function errors", async () => {
                try {
                        await testClass.rejectAsync();
                } catch (error: any) {
                        expect(error).toBeInstanceOf(ValidationError);
                }
        });

        it("should resolve async function when no error", async () => {
                const name = await testClass.resolveAsync();
                expect(name).toBe(testClass.name);
        });

        it("should transform sync function errors", () => {
                try {
                        testClass.rejectSync();
                } catch (error: any) {
                        expect(error).toBeInstanceOf(ValidationError);
                }
        });

        it("should resolve sync function when no error", () => {
                const name = testClass.resolveSync();
                expect(name).toBe(testClass.name);
        });
});
