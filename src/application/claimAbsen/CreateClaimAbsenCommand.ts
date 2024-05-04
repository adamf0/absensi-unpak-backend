import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateClaimAbsenCommand extends Command {
    public absenId: string;
    public catatan: string|null;
    public dokumen: string|null;
    
    constructor(
      absenId:string,
      catatan:string|null,
      dokumen:string|null,
    ) {
      super();
      this.absenId = absenId
      this.catatan = catatan
      this.dokumen = dokumen
    }
}