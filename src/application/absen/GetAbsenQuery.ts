import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetAbsenQuery implements IQuery {
    public nidn: string|null;
    public nip: string|null;
    public tanggal: string;
    
    constructor(
      nidn: string|null=null,
      nip: string|null=null,
      tanggal: string,
    ) {
      this.nidn = nidn;
      this.nip = nip;
      this.tanggal = tanggal;
    }
}