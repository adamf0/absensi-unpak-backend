import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetAllIzinByNIDNYearMonthQuery implements IQuery {
    public nidn: string;
    public year_month: string;
    constructor(
        nidn:string,
        year_month:string,
    ) {
      this.nidn = nidn
      this.year_month = year_month
    }
}