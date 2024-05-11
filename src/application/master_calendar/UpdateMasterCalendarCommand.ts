import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class UpdateMasterCalendarCommand extends Command {
    public id: number;
    public tanggal_mulai: string;
    public tanggal_akhir: string;
    public keterangan: string;
    
    constructor(
      id: number,
      tanggal_mulai: string,
      tanggal_akhir: string,
      keterangan: string,
    ) {
      super();
      this.id = id
      this.tanggal_mulai = tanggal_mulai
      this.tanggal_akhir = tanggal_akhir
      this.keterangan = keterangan
    }
}