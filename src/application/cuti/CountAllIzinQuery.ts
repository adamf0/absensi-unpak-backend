import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class CountAllIzinQuery implements IQuery {
    public nidn: string|null;
    public nip: string|null;
    public tanggal_mulai: string;
    public tanggal_berakhir: string;
    
    constructor(
      nidn: string|null,
      nip: string|null,
      tanggal_mulai: string,
      tanggal_berakhir: string,
    ) {
      this.nidn = nidn;
      this.nip = nip;
      this.tanggal_mulai = tanggal_mulai;
      this.tanggal_berakhir = tanggal_berakhir;
    }
}