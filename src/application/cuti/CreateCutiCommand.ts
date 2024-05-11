import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateCutiCommand extends Command {
    public nidn: string|null;
    public nip: string|null;
    public tanggal_mulai: string;
    public tanggal_akhir: string;
    public lama_cuti: number;
    public tujuan: string;
    public jenis_cuti: string;
    public dokumen: string|null;
    
    constructor(
      nidn:string|null,
      nip:string|null,
      tanggal_mulai:string,
      tanggal_akhir:string,
      lama_cuti:number,
      tujuan:string,
      jenis_cuti:string,
      dokumen:string|null,
    ) {
      super();
      this.nidn = nidn
      this.nip = nip
      this.tanggal_mulai = tanggal_mulai
      this.tanggal_akhir = tanggal_akhir
      this.lama_cuti = lama_cuti
      this.tujuan = tujuan
      this.jenis_cuti = jenis_cuti
      this.dokumen = dokumen
    }
}