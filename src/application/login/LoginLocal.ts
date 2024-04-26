import { getConnection } from "typeorm";
import { LoginProxy } from "../abstractions/LoginProxy";
import { User } from "../../infrastructure/orm/User";
import { LoginSimak } from "./LoginSimak";
import { Dosen } from "../../infrastructure/orm/Dosen";
import { UserEntity } from "../../domain/entity/UserEntity";

export class LoginLocal implements LoginProxy {
    async login(username:string, password:string){
        const _db = await getConnection("default");
        const user = await _db.getRepository(User).findOne({
            where: {
                username: username,
                password: password
            },
            relations: {
            //   Dosen: true,
            },
        })
        // console.log(user,user==null)
        let dosen = null
        let levels = []
        if(user?.level){
            levels.push(user.level)
        }

        if(user==null){
            const simak = new LoginSimak()
            return simak.login(username,password);
        } else if(user.NIDN){
            const _db1 = await getConnection("simak");
            dosen = await _db1.getRepository(Dosen).findOne({
                where: {
                    NIDN: user.NIDN
                },
                relations: {
                //   Dosen: true,
                },
            })
            if(dosen){
                levels.push("dosen")
            }        
        }

        return new UserEntity(
            user.id+"",
            user.nama,
            levels,
        )
    }
}