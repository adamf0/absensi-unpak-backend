import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateMasterCalendarCommand extends Command {
    public tanggal_mulai: string;
    public tanggal_akhir: string;
    public keterangan: string;
    
    constructor(
      tanggal_mulai: string,
      tanggal_akhir: string,
      keterangan: string,
    ) {
      super();
      this.tanggal_mulai = tanggal_mulai
      this.tanggal_akhir = tanggal_akhir
      this.keterangan = keterangan
    }
}