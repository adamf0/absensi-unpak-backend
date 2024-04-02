import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"

@Entity("absen")
@Index(['nidn', 'tanggal'])
@Index(['tanggal', 'absen_keluar'])
export class Absen {

    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 20, type: "varchar"})
    nidn: string

    @Column("date")
    tanggal: string

    @Column("datetime")
    absen_masuk: string

    @Column("datetime",{nullable: true})
    absen_keluar: string
}
