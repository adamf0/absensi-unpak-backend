import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetAllCutiByNIDNYearMonthQuery implements IQuery {
    public nidn: string|null;
    public nip: string|null;
    public year_month: string;
    constructor(
        nidn:string|null=null,
        nip:string|null=null,
        year_month:string,
    ) {
      this.nidn = nidn
      this.nip = nip
      this.year_month = year_month
    }
}