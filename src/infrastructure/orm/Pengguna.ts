import "reflect-metadata"
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne} from "typeorm"
import { Pegawai } from "./Pegawai"

@Entity("pengguna")
export class Pengguna {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", unique: false})
    username: string

    @Column({length: 100, type: "varchar"})
    password: string

    @Column({length: 50, type: "varchar"})
    level: string

    @Column()
    status: string

    @OneToOne(() => Pegawai, Pegawai => Pegawai.nip, {
        eager: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "username" })
    Pegawai: Pegawai
}