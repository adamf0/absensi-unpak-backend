import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateJenisCutiCommand extends Command {
    public nama: string;
    public min: string;
    public max: string;
    public kondisi: any;
    public dokumen: boolean;
    
    constructor(
      nama: string,
      min: string,
      max: string,
      kondisi: any,
      dokumen: boolean,
    ) {
      super();
      this.nama = nama
      this.min = min
      this.max = max
      this.kondisi = kondisi
      this.dokumen = dokumen
    }
}