import { Registry } from "./index";

class Socket {
    private connectionID: number;

    constructor(address: string) {
        this.connectionID = this.connect(address);
    }

    public connect(address: string) {
        // Do connection
        return 12345;
    }

    public disconnect() {
        // Disconnect
        // tslint:disable-next-line:no-console
        console.log("disconnecting");
    }

    public teardown() {
        this.disconnect();
    }
}

const registry = new Registry();

registry.define("socketComponent", () => new Socket("127.0.0.1"));

registry.get<Socket>("socketComponent").disconnect();
