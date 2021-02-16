/**
 * Error class for undefined components
 */
export class UndefinedError extends Error {
    /**
     * Creates error with undefined component message
     * @param {string} componentName - Name of component to error on
     */
    constructor(componentName: string) {
        super(`Component ${componentName} was not defined.`);
    }
}