import { AlreadyDefinedError } from "./AlreadyDefinedError";
import { DependencyError } from "./DependencyError";
import { UndefinedError } from "./UndefinedError";

/**
 * Inversion of control registry.
 * Holds components and their definition to create component only when necessary.
 */
export default class Registry {
    private components: Map<string, any> = new Map(); // Dictionary of component names to component
    private definitions: Map<string, () => any> = new Map(); // Dictionary of component names to their creation function
    private createdComponents: Set<string> = new Set(); // Set of components already created

    /**
     * Defines a component and its creator function
     * @param {string} componentName - name of component to be added to registry
     * @param {() => any} creator - creator function to initialize a component
     */
    public define(componentName: string, creator: () => any): void {
        if (this.definitions.has(componentName)) {
            throw new AlreadyDefinedError(componentName);
        }

        this.definitions.set(componentName, creator);
    }

    /**
     * Returns component with matching component name.
     * If component wasn't initialized, initialize before returning.
     * @param {string} componentName - name of component to fetch
     * @returns {any} Component with matching component name
     */
    public get(componentName: string): any  {
        const component = this.components.get(componentName);
        if (component !== undefined) {
            return component;
        }

        return this.createAndAdd(componentName);
    }

    /**
     * Tears down registry by tearing down registry's components when necessary
     */
    public teardown(): void {
        this.components.forEach((component: any) => {
            if (typeof component === "object" &&
            component.hasOwnProperty("teardown") &&
            typeof component.teardown === "function" ) {
                component.teardown();
            }
        });
    }

    /**
     * Initializes given component and adds it components, checks for cross-dependencies
     * @param {string} componentName - Name of component to be initialized
     * @returns {any} component that is initialized
     */
    private createAndAdd(componentName: string): any {
        if (this.createdComponents.has(componentName)) {
            throw new DependencyError(componentName);
        }

        // Make sure we already have a defintion before trying to create
        const definition = this.definitions.get(componentName);
        if (definition === undefined) {
            throw new UndefinedError(componentName);
        }

        // Mark it as already created
        this.createdComponents.add(componentName);

        const component = definition();
        this.components.set(componentName,component);
        return component;
    }
}
