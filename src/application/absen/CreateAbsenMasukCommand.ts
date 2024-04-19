import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateAbsenMasukCommand extends Command {
    public nidn: string;
    public tanggal: string;
    public absen_masuk: string;
    public catatan: string;

    constructor(
      nidn: string,
      tanggal: string,
      absen_masuk: string,
      catatan: string,
    ) {
      super();
      this.nidn = nidn;
      this.tanggal = tanggal;
      this.absen_masuk = absen_masuk;
      this.catatan = catatan;
    }
  }