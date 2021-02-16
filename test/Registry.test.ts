import Registry from "../src/Registry";

describe("test adding basic registry components", () => {

    it("should correctly save and return basic component types", () => {
        const registry = new Registry();

        registry.define("strService", () => "Test");
        registry.define("numService", () => 23);
        registry.define("nullService", () => null);
        registry.define("undefinedService", () => { return; });

        expect(registry.get("strService")).toBe("Test");
        expect(registry.get("numService")).toBe(23);
        expect(registry.get("nullService")).toBeNull();
        expect(registry.get("undefinedService")).toBeUndefined();
    });

    it("should correctly save and return function component type that can be called", () => {
        const registry = new Registry();

        registry.define("fnService", () => { return (num: number) => num + 1 });

        const fnComponent = registry.get("fnService");
        expect(typeof fnComponent === "function").toEqual(true);
        expect(fnComponent(1)).toBe(2);
    });

    it("should correctly save and return object component type", () => {
        const registry = new Registry();

        registry.define("objService",() => ({ name: "ComponentObj", returns23: () => 23 }));

        const objComponent = registry.get("objService");
        expect(typeof objComponent === "object").toEqual(true);
        expect(objComponent.name).toBe("ComponentObj");
        expect(objComponent.returns23()).toBe(23);
    });

    it ("should make sure registry is lazy loaded", () => {
        const registry = new Registry();
        const creator = jest.fn(() => 1);

        registry.define("service", creator);
        expect(creator).toHaveBeenCalledTimes(0);

        registry.get("service");
        expect(creator).toHaveBeenCalledTimes(1);

        registry.get("service");
        expect(creator).toHaveBeenCalledTimes(1);
    });
});

describe("test error throwning on incorrect usage", () => {
    it("should throw circular dependency error", () => {
        const registry = new Registry();
        class A {
            private b: B = registry.get("aComponent");
        }
        // tslint:disable-next-line:max-classes-per-file
        class B {
            private a: A = registry.get("bComponent");
        }

        registry.define("aComponent",() => new A());
        registry.define("bComponent",() => new B());

        // Would be better to check Error Type, but JEST has problems with extending error
        expect(() => {registry.get("aComponent")}).toThrow("Component aComponent has already been created. Circular dependency may exist");
    });

    it("should throw an already defined error", () => {
        const registry = new Registry();
        registry.define("duplicateComponent", () => ({}));

        // Would be better to check Error Type, but JEST has problems with extending error
        expect(() => { registry.define("duplicateComponent", () => 23) }).toThrow("Component duplicateComponent has already been defined.")
    });

    it("should throw an error for undefined component", () => {
        const registry = new Registry();

        // Would be better to check Error Type, but JEST has problems with extending error
        expect(() => { registry.get("undefinedComponent") }).toThrow("Component undefinedComponent was not defined.");
    });
});

describe("test correctly tearing down registry", () => {
    it("should not call an component's teardown property on teardown if component was not created", () => {
        const registry = new Registry();
        const teardownFn = jest.fn(() => 1);

        registry.define("objectComponent", () => ({ teardown: teardownFn, name: "objectComponentName" }));
        registry.teardown();
        expect(teardownFn).toHaveBeenCalledTimes(0);
    });

    it("should call an component's teardown property on teardown if component was created", () => {
        const registry = new Registry();
        const teardownFn = jest.fn(() => 1);

        registry.define("objectComponent", () => ({ teardown: teardownFn, name: "objectComponentName" }));
        registry.get("objectComponent")
        registry.teardown();
        expect(teardownFn).toHaveBeenCalledTimes(1);
    });

    it("should not call a components teardown property if it's not a function", () => {
        const registry = new Registry();

        registry.define("objectComponent", () => ({ teardown: "Can't tear me down", name: "objectComponentName" }));
        registry.get("objectComponent")
        registry.teardown();
    })
})