import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class UpdateJenisCutiCommand extends Command {
  public id: number;
  public nama: string;
  public min: string;
  public max: string;
  public kondisi: any;
  public dokumen: boolean;
  
  constructor(
    id: number,
    nama: string,
    min: string,
    max: string,
    kondisi: any,
    dokumen: boolean,
  ) {
    super();
    this.id = id
    this.nama = nama
    this.min = min
    this.max = max
    this.kondisi = kondisi
    this.dokumen = dokumen
  }
}