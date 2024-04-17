import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateIzinCommand extends Command {
    public nidn: string;
    public tanggal_pengajuan: string;
    public tujuan: string;
    public jenis_izin: string;
    public dokumen: string|null;
    
    constructor(
      nidn:string,
      tanggal_pengajuan:string,
      tujuan:string,
      jenis_izin:string,
      dokumen:string|null,
    ) {
      super();
      this.nidn = nidn
      this.tanggal_pengajuan = tanggal_pengajuan
      this.tujuan = tujuan
      this.jenis_izin = jenis_izin
      this.dokumen = dokumen
    }
}