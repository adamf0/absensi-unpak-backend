import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm"

@Entity()
export class Cuti {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column({length: 20, type: "varchar"})
    nidn: string

    @Column("date")
    tanggal_pengajuan: string

    @Column("int")
    lama_cuti: number

    @Column("text")
    tujuan: string

    @Column()
    jenis_cuti: string
}
