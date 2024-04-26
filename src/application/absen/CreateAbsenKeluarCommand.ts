import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateAbsenKeluarCommand extends Command {
    public nidn: string|null;
    public nip: string|null;
    public tanggal: string;
    public absen_keluar: string;
    public catatan: string;
    
    constructor(
      nidn: string|null=null,
      nip: string|null=null,
      tanggal: string,
      absen_keluar: string,
      catatan: string,
    ) {
      super();
      this.nidn = nidn;
      this.nip = nip;
      this.tanggal = tanggal;
      this.absen_keluar = absen_keluar;
      this.catatan = catatan;
    }
  }