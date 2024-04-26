import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class UpdateCutiCommand extends Command {
    public id: number;
    public nidn: string|null;
    public nip: string|null;
    public tanggal_pengajuan: string;
    public lama_cuti: number;
    public tujuan: string;
    public jenis_cuti: string;
    public dokumen: string|null;
    
    constructor(
      id:number,
      nidn:string|null,
      nip:string|null,
      tanggal_pengajuan:string,
      lama_cuti:number,
      tujuan:string,
      jenis_cuti:string,
      dokumen:string|null,
    ) {
      super();
      this.id = id
      this.nidn = nidn
      this.nip = nip
      this.tanggal_pengajuan = tanggal_pengajuan
      this.lama_cuti = lama_cuti
      this.tujuan = tujuan
      this.jenis_cuti = jenis_cuti
      this.dokumen = dokumen
    }
}