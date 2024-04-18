import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class UpdateJenisIzinCommand extends Command {
  public id: number;
  public nama: string;
  
  constructor(
    id: number,
    nama: string,
  ) {
    super();
    this.id = id
    this.nama = nama
  }
}