import "reflect-metadata"
import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne} from "typeorm"
import { LevelUser } from "../../domain/enum/LevelUser"
import { Dosen } from "./Dosen"

@Entity("user")
export class UserSimak {
    
    @PrimaryColumn({length: 50, type: "varchar"})
    userid : string

    @Column({length: 50, type: "varchar"})
    username : string

    @Column({type: "mediumtext"})
    password: string

    @Column({length: 100, type: "varchar"})
    nama: string

    @Column({
        type: "enum",
        enum: LevelUser,
        default: LevelUser.MAHASISWA,
    })
    status: string


    @OneToOne(() => Dosen, Dosen => Dosen.NIDN, {
        eager: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "userid" })
    Dosen: Dosen
}
