import { inject } from "inversify";
import { RuleStrategy } from "../../application/abstractions/RuleStrategy";
import { GetAllCutiByNIDNYearMonthQuery } from "../../application/cuti/GetAllCutiByNIDNYearMonthQuery";
import { ICommandBus } from "../../infrastructure/abstractions/messaging/ICommandBus";
import { IQueryBus } from "../../infrastructure/abstractions/messaging/IQueryBus";
import { TYPES } from "../../infrastructure/types";
import { OutRuleState } from "../entity/OutRuleState";

export class RuleCheckRegistryCuti implements RuleStrategy {
    constructor(
        private nidn:string,
        private year_month:string,
        private tanggal:string,
        private _commandBus: ICommandBus,
        private _queryBus: IQueryBus
    ) {
    }

    async rule(): Promise<OutRuleState> {
        let list_cuti = await this._queryBus.execute(
            new GetAllCutiByNIDNYearMonthQuery(this.nidn, this.year_month)
        );
        list_cuti = list_cuti.reduce((acc, item) => {
            for (let i = 0; i < item.lama_cuti; i++) {
                const tanggal = new Date(new Date(item.tanggal_pengajuan).getTime() + (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
                const cutiObj = {
                    id: item.id,
                    tanggal: tanggal,
                    type: "cuti",
                    tujuan: item.tujuan,
                    jenis_cuti: item.jenis_cuti,
                    JenisCuti: item.JenisCuti
                };
                if(this.tanggal==tanggal){
                    acc.push(cutiObj);
                }
            }
            return acc;
        }, [])

        return {rule: list_cuti.length>0, payload:list_cuti[0]};
    }
}