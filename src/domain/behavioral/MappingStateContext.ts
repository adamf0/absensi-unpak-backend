import { MappingStateInterface } from "../../application/abstractions/MappingStateInterface";
import { RuleStrategy } from "../../application/abstractions/RuleStrategy";

export class MappingStateContext {
    states: { output: MappingStateInterface, rule: RuleStrategy }[] = [];

    constructor() {}

    addState(strategy: RuleStrategy, state: MappingStateInterface): void {
        this.states.push({ output: state, rule: strategy });
    }

    async handleState(clearState: boolean = false): Promise<any> {
        let output: any = null;
        for (const state of this.states) {
            const exec = await state.rule.rule()
            if (exec.rule) {
                output = state.output.handle(exec.payload);
                break;
            }
        }
        if (clearState) this.states = [];

        return output;
    }
}