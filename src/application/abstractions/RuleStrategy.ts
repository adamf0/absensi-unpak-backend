import { OutRuleState } from "../../domain/entity/OutRuleState";

export interface RuleStrategy {
    rule(): Promise<OutRuleState>;
}