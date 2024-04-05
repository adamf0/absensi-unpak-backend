import { getConnection } from "typeorm";
import { LoginProxy } from "../abstractions/LoginProxy";
import { User } from "../../infrastructure/orm/User";
import { LoginSimak } from "./LoginSimak";

export class LoginLocal implements LoginProxy {
    async login(username:string, password:string){
        const con = await getConnection("simak");
        const user = await con.getRepository(User)
        .createQueryBuilder("user")
        .where("username", { username: username })
        .where("password", { password: password })
        .getOne();

        if(user===null){
            const simak = new LoginSimak()
            return simak.login(username,password);
        }

        return user
    }
}