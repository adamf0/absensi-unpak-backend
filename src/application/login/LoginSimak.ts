import { getConnection } from "typeorm";
import { LoginProxy } from "../abstractions/LoginProxy";
import { UserSimak } from "../../infrastructure/orm/UserSimak";

export class LoginSimak implements LoginProxy {
    async login(username:string, password:string){
        const con = await getConnection("simak");
        const dosen = await con.getRepository(UserSimak)
        .createQueryBuilder("user")
        .where("nidn = :nidn and password = sha1(md5(:password))", { nidn: username, password: password })
        .leftJoinAndSelect("user.Dosen", "dosen")
        .getOne();

        return dosen;
    }
}