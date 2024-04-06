import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateUserCommand extends Command {
    public nama: string;
    public username: string;
    public password: string;
    public level: string;
    
    constructor(
      nama:string,
      username:string,
      password:string,
      level:string,
    ) {
      super();
      this.nama = nama
      this.username = username
      this.password = password
      this.level = level
    }
  }