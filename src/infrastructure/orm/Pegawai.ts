import "reflect-metadata"
import { Entity, Column, OneToOne, PrimaryGeneratedColumn, PrimaryColumn} from "typeorm"
import { Pengguna } from "./Pengguna"

@Entity("n_pribadi")
export class Pegawai {

    // @PrimaryGeneratedColumn()
    // id_n_pribadi: number

    @PrimaryColumn({length: 30, type: "varchar"})
    // @Column({length: 30, type: "varchar"})
    nip: string

    @Column({length: 30, type: "varchar"})
    status_pegawai: string

    @Column({length: 50, type: "varchar"})
    nama: string

    @OneToOne(() => Pengguna, Pengguna => Pengguna.username,{
    })
    Pengguna: Pengguna

    // @OneToOne(() => User, User => User.NIDN,{ //masih bermasalah relasi beda koneksi
    // })
    // User: User
}
