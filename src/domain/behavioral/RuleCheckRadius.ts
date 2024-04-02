import { RuleStrategy } from "../../application/abstractions/RuleStrategy";
import { OutRuleState } from "../entity/OutRuleState";
import { distance } from "../../infrastructure/utility/Utility";

export class RuleCheckRadius implements RuleStrategy {
    constructor(
        private lat:number,
        private long:number,
        private lat_target:number,
        private long_target:number,
        private metric:string,
    ) {
    }

    async rule(): Promise<OutRuleState> {
        const jarak = distance(this.lat, this.long, this.lat_target, this.long_target, this.metric);
        return {rule: !(jarak >= 0 && jarak <= 800), payload:jarak};
    }
}