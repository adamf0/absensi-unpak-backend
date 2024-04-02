import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateIzinCommand extends Command {
    public nidn: string;
    public tanggal_pengajuan: string;
    public tujuan: string;
    
    constructor(
      nidn:string,
      tanggal_pengajuan:string,
      tujuan:string,
    ) {
      super();
      this.nidn = nidn
      this.tanggal_pengajuan = tanggal_pengajuan
      this.tujuan = tujuan
    }
  }