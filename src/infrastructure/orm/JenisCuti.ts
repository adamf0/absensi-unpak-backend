import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("jenis_cuti")
export class JenisCuti {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column({length: 255, type: "varchar"})
    nama: string

    @Column("int")
    min: number

    @Column("int")
    max: number

    @Column("text")
    kondisi: string

    @Column()
    dokumen: boolean
}
