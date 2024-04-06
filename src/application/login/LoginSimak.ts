import { getConnection } from "typeorm";
import { LoginProxy } from "../abstractions/LoginProxy";
import { UserSimak } from "../../infrastructure/orm/UserSimak";
import * as crypto from "crypto"
import { UserEntity } from "../../domain/entity/UserEntity";

function md5(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}
function sha1(input) {
    return crypto.createHash('sha1').update(input).digest('hex');
}

export class LoginSimak implements LoginProxy {
    async login(username:string, password:string){
        const _db = await getConnection("simak");
        const user = await _db.getRepository(UserSimak).findOneOrFail({
            where: {
                userid: username,
                password: sha1(md5(password))
            },
            relations: {
              Dosen: true,
            },
        })

        return new UserEntity(
            user.userid,
            user.nama,
            ["dosen"],
            user.Dosen.NIDN,
            user.Dosen.kode_fak,
            user.Dosen.kode_jurusan,
            user.Dosen.kode_prodi,
        )
    }
}