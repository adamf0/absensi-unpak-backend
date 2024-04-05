import "reflect-metadata"
import { Entity, Column, PrimaryColumn, OneToMany} from "typeorm"
import { UserSimak } from "./UserSimak"

@Entity("m_dosen")
export class Dosen {

    @PrimaryColumn({length: 50, type: "varchar"})
    NIDN: string

    @Column({length: 9, type: "char"})
    kode_fak: string

    @Column({length: 5, type: "char"})
    kode_jurusan: string

    @Column({length: 10, type: "char"})
    kode_prodi: string

    @Column({length: 50, type: "varchar"})
    nama_dosen: string

    @OneToMany(() => UserSimak, UserSimak => UserSimak.userid,{
    })
    cuti: UserSimak[]
}
