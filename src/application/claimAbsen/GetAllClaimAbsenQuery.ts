import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class GetAllClaimAbsenQuery implements IQuery {
    public take: number;
    public skip: number;
    public nidn: string|null;
    public nip: string|null;
    constructor(
        take:number,
        skip:number,
        nidn:string|null = null,
        nip:string|null = null,
    ) {
      this.take = take
      this.skip = skip
      this.nidn = nidn
      this.nip = nip
    }
}