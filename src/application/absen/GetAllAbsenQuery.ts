import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetAllAbsenQuery implements IQuery {
    public take: any;
    public skip: any;
    public nidn: string|null;
    public nip: string|null;
    constructor(
        take:any,
        skip:any,
        nidn:string|null = null,
        nip:string|null = null,
    ) {
      this.take = take
      this.skip = skip
      this.nidn = nidn
      this.nip = nip
    }
}