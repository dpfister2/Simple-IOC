/**
 * Error class for circular dependencies
 */
export class DependencyError extends Error {
    /**
     * Creates error with circular dependency message
     * @param {string} componentName - Name of component to error on
     */
    constructor(componentName: string) {
        super(`Component ${componentName} has already been created. Circular dependency may exist`);
    }
}
