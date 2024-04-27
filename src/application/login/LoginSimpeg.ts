import { getConnection } from "typeorm";
import { LoginProxy } from "../abstractions/LoginProxy";
import * as crypto from "crypto"
import { UserEntity } from "../../domain/entity/UserEntity";
import { Pengguna } from "../../infrastructure/orm/Pengguna";

function sha1(input) {
    return crypto.createHash('sha1').update(input).digest('hex');
}

export class LoginSimpeg implements LoginProxy {
    async login(username:string, password:string){
        const _db = await getConnection("simpeg");
        const users = await _db.getRepository(Pengguna).find({
            where: {
                username: username,
                level: "PEGAWAI"
            },
            relations: {
                Pegawai: true,
            },
        })
        let user = users.filter(user=>user.password==sha1(password))
        if(user.length>1){
            throw new Error(`ditemukan akun ganda dengan username ${username}`)
        } else if(user.length==0){
            throw new Error("akun tidak ditemukan")
        }

        return new UserEntity(
            user[0].id.toString(),
            user[0]["Pegawai"]?.nama,
            ["pegawai"],
            null,
            username
        )
    }
}