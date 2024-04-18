import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class UpdatePenggunaCommand extends Command {
    public id: number;
    public username: string;
    public password: string;
    public nama: string;
    public level: string;
    public nidn: string;
    
    constructor(
      id:number,
      username:string,
      password:string,
      nama:string,
      level:string,
      nidn:string,
    ) {
      super();
      this.id = id
      this.username = username
      this.password = password
      this.nama = nama
      this.level = level
      this.nidn = nidn
    }
}