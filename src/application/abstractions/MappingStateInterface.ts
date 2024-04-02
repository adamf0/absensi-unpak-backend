import { MappingState } from "./MappingState";

export abstract class MappingStateInterface implements MappingState {
    output: any = null;

    handle(data:any): void {
        throw new Error("Method not implemented.");
    }

    getOutput(): any {
        return this.output;
    }
}