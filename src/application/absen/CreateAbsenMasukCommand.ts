import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateAbsenMasukCommand extends Command {
    public nidn: string|null;
    public nip: string|null;
    public tanggal: string;
    public absen_masuk: string;
    public catatan: string;

    constructor(
      nidn: string|null=null,
      nip: string|null=null,
      tanggal: string,
      absen_masuk: string,
      catatan: string,
    ) {
      super();
      this.nidn = nidn;
      this.nip = nip;
      this.tanggal = tanggal;
      this.absen_masuk = absen_masuk;
      this.catatan = catatan;
    }
  }