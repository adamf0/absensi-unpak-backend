import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class CountAllCutiOnWaitingQuery implements IQuery {
    public nidn:string|null
    public nip:string|null

    constructor(
        nidn:string|null = null,
        nip:string|null = null
    ) {
        this.nidn = nidn
        this.nip = nip
    }
}