import { IQuery } from "../../infrastructure/abstractions/messaging/IQuery";

export class CountAllCutiQuery implements IQuery {
    public nidn: string;
    public tanggal_mulai: string;
    public tanggal_berakhir: string;
    
    constructor(
      nidn: string,
      tanggal_mulai: string,
      tanggal_berakhir: string,
    ) {
      this.nidn = nidn;
      this.tanggal_mulai = tanggal_mulai;
      this.tanggal_berakhir = tanggal_berakhir;
    }
}