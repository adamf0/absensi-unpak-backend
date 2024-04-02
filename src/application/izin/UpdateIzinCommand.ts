import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class UpdateIzinCommand extends Command {
    public id: number;
    public nidn: string;
    public tanggal_pengajuan: string;
    public tujuan: string;
    
    constructor(
      id:number,
      nidn:string,
      tanggal_pengajuan:string,
      tujuan:string,
    ) {
      super();
      this.id = id
      this.nidn = nidn
      this.tanggal_pengajuan = tanggal_pengajuan
      this.tujuan = tujuan
    }
  }