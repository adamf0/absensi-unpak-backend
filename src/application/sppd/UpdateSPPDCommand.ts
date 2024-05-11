import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class UpdateSPPDCommand extends Command {
  public id: number;
  public nidn: string|null
    public nip: string|null
    public anggota: Array<string> = []
    public jenis_sppd: string
    public tujuan: string
    public tanggal_berangkat: string
    public tanggal_kembali: string
    public keterangan: string|null
    
    constructor(
      id: number,
      nidn: string|null,
      nip: string|null,
      anggota: Array<string> = [],
      jenis_sppd: string,
      tujuan: string,
      tanggal_berangkat: string,
      tanggal_kembali: string,
      keterangan: string|null,
    ) {
      super();
        this.id = id
        this.nidn = nidn
        this.nip = nip
        this.anggota = anggota
        this.jenis_sppd = jenis_sppd
        this.tujuan = tujuan
        this.tanggal_berangkat = tanggal_berangkat
        this.tanggal_kembali = tanggal_kembali
        this.keterangan = keterangan
    }
}