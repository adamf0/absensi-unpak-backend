import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class UpdateIzinCommand extends Command {
    public id: number;
    public nidn: string|null;
    public nip: string|null;
    public tanggal_pengajuan: string;
    public tujuan: string;
    public jenis_izin: string;
    public dokumen: string|null;
    
    constructor(
      id:number,
      nidn:string|null,
      nip:string|null,
      tanggal_pengajuan:string,
      tujuan:string,
      jenis_izin:string,
      dokumen:string|null,
    ) {
      super();
      this.id = id
      this.nidn = nidn
      this.nip = nip
      this.tanggal_pengajuan = tanggal_pengajuan
      this.tujuan = tujuan
      this.jenis_izin = jenis_izin
      this.dokumen = dokumen
    }
}