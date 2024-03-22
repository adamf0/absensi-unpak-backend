import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateAbsenKeluarCommand extends Command {
    public nidn: string;
    public tanggal: string;
    public absen_keluar: string;
    
    constructor(
      nidn: string,
      tanggal: string,
      absen_keluar: string,
    ) {
      super();
      this.nidn = nidn;
      this.tanggal = tanggal;
      this.absen_keluar = absen_keluar;
    }
  }