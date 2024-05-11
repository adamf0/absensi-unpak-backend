import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class UpdateClaimAbsenCommand extends Command {
    public id: number;
    public absenId: string;
    public catatan: string|null;
    public dokumen: string|null;
    public absen_masuk: string|null;
    public absen_keluar: string|null;
    
    constructor(
      id:number,
      absenId:string,
      catatan:string|null,
      dokumen:string|null,
      absen_masuk:string|null,
      absen_keluar:string|null,
    ) {
      super();
      this.id = id
      this.absenId = absenId
      this.catatan = catatan
      this.dokumen = dokumen
      this.absen_masuk = absen_masuk
      this.absen_keluar = absen_keluar
    }
}