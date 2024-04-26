import { getConnection } from "typeorm";
import { LoginProxy } from "../abstractions/LoginProxy";
import { UserSimak } from "../../infrastructure/orm/UserSimak";
import * as crypto from "crypto"
import { UserEntity } from "../../domain/entity/UserEntity";
import { LoginSimpeg } from "./LoginSimpeg";

function md5(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}
function sha1(input) {
    return crypto.createHash('sha1').update(input).digest('hex');
}

export class LoginSimak implements LoginProxy {
    async login(username:string, password:string){
        const _db = await getConnection("simak");
        const users = await _db.getRepository(UserSimak).find({
            where: {
                userid: username,
            },
            relations: {
              Dosen: true,
            },
        })

        let user = users.filter(user=>user.password==sha1(md5(password)))
        if(user.length>1){
            throw new Error(`ditemukan akun ganda dengan username ${username}`)
        } else if(user.length==0){
            const simpeg = new LoginSimpeg()
            return simpeg.login(username,password);
        }

        return new UserEntity(
            user[0].userid,
            user[0].nama,
            ["dosen"],
            user[0].Dosen.NIDN,
            null,
            user[0].Dosen.kode_fak,
            user[0].Dosen.kode_jurusan,
            user[0].Dosen.kode_prodi,
        )
    }
}