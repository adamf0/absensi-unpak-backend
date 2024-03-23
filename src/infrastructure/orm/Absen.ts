import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"

@Entity("absen")
@Index(['nidn', 'tanggal'], { unique: true }) //index ganda
@Index(['tanggal', 'absen_keluar'], { unique: true }) //index ganda
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
