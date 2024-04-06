import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class UpdateUserCommand extends Command {
    public id: number;
    public nama: string;
    public username: string;
    public password: string;
    public level: string;
    
    constructor(
      id:number,
      nama:string,
      username:string,
      password:string,
      level:string,
    ) {
      super();
      this.id = id
      this.nama = nama
      this.username = username
      this.password = password
      this.level = level
    }
  }