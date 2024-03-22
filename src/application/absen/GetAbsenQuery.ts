import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetAbsenQuery implements IQuery {
    public nidn: string;
    public tanggal: string;
    
    constructor(
      nidn: string,
      tanggal: string,
    ) {
      this.nidn = nidn;
      this.tanggal = tanggal;
    }
}