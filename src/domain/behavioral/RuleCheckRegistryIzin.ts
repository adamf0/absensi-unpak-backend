import { RuleStrategy } from "../../application/abstractions/RuleStrategy";
import { ICommandBus } from "../../infrastructure/abstractions/messaging/ICommandBus";
import { IQueryBus } from "../../infrastructure/abstractions/messaging/IQueryBus";
import { OutRuleState } from "../entity/OutRuleState";
import { GetAllIzinByNIDNYearMonthQuery } from "../../application/izin/GetAllIzinByNIDNYearMonthQuery";

export class RuleCheckRegistryIzin implements RuleStrategy {
    constructor(
        private nidn:string,
        private year_month:string,
        private tanggal:string,
        private _commandBus: ICommandBus,
        private _queryBus: IQueryBus
    ) {
    }

    async rule(): Promise<OutRuleState> {
        let list_izin = await this._queryBus.execute(
            new GetAllIzinByNIDNYearMonthQuery(this.nidn, this.year_month)
        );
        list_izin = list_izin.reduce((acc, item) => {
            if(this.tanggal==new Date(item.tanggal_pengajuan).toISOString().split('T')[0]){
                acc.push(item);
            }
            return acc
        }, [])

        return {rule: list_izin.length>0, payload:list_izin[0]};
    }
}