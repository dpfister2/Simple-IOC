## To Note
Since this development is only for a take home challenge, I won't be publishing using NPM. I went through the process of how a normal library would be created, but without the final publishing steps. Because of this, this repo is slightly unorthodox.

Because of the lack of publishing, it might be easiest to directly update index.js with instances of the Registry and then try adding components from there (or even better, create a new ts file and import from index).

# Simple-IOC
Simple Inversion of Control library that allows users to define a component with a name identification and creator method, and then retrieve the component later using the component name.
It uses lazy loading to only create components when needed and is able to identify and error on a cross-dependency,
as well as other simple checks and the ability to teardown upon completion.

## Testing
After grabbing the code, proceed to the local folder and run "npm install"

To run Jest tests: "npm run test"

## Example
The inversion of control library does not use injectors, so the general usage will be creating the Registry, defining a component's creator method, and then trying to retrieve that component using the get method.

Here is an example that creates two components and then retrieves them right after
```typescript
// Example.ts
import { Registry } from "./index"

class Example {
    private prop1: number;
    private prop2: string;

    constructor(num: number, str: string) {
        this.prop1 = num;
        this.prop2 = str;
    }
}

const registry = new Registry();

registry.define("exampleClassComponent", () => new Example(23, "ABC"));
registry.define("exampleFnComponent", () => { return (num: number) => num + 1 });

const exampleClass = registry.get("exampleClassComponent");
if (exampleClass.prop1 === 23) { // true
    // Yay 23
}
if (exampleClass.prop2 === "ABC") { // true
    // Yay "ABC"
}

const exampleFn = registry.get("exampleFnComponent");
exampleFn(1) // 1 + 1 = 2
```
