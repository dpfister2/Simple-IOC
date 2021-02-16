/**
 * Error class for already defined components
 */
export class AlreadyDefinedError extends Error {
    /**
     * Creates error with already defined message
     * @param {string} componentName - Name of component to error on
     */
    constructor(componentName: string) {
        super(`Component ${componentName} has already been defined.`);
    }
}
