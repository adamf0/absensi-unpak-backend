import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class UpdateClaimAbsenCommand extends Command {
    public id: number;
    public absenId: string;
    public catatan: string|null;
    public dokumen: string|null;
    
    constructor(
      id:number,
      absenId:string,
      catatan:string|null,
      dokumen:string|null,
    ) {
      super();
      this.id = id
      this.absenId = absenId
      this.catatan = catatan
      this.dokumen = dokumen
    }
}