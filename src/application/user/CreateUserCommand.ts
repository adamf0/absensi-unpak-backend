import { Command } from "../../infrastructure/abstractions/messaging/Command";

export class CreateUserCommand extends Command {
    public username: string;
    public password: string;
    public level: string;
    
    constructor(
      username:string,
      password:string,
      level:string,
    ) {
      super();
      this.username = username
      this.password = password
      this.level = level
    }
  }