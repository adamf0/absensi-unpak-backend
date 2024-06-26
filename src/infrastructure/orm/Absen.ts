import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne } from "typeorm"
import { ClaimAbsen } from "./ClaimAbsen"

@Entity("absen")
@Index(['nidn', 'tanggal'])
@Index(['nip', 'tanggal'])
@Index(['tanggal', 'absen_keluar'])
export class Absen {

    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 20, type: "varchar", nullable: true})
    nidn: string

    @Column({length: 20, type: "varchar", nullable: true})
    nip: string

    @Column("date")
    tanggal: string

    @Column("datetime",{nullable: true,})
    absen_masuk: string

    @Column("datetime",{nullable: true})
    absen_keluar: string

    @Column("text",{nullable: true})
    catatan_telat: string

    @Column("text",{nullable: true})
    catatan_pulang: string

    @Column("boolean")
    otomatis_keluar: boolean
    
    @OneToOne(() => ClaimAbsen, ClaimAbsen => ClaimAbsen.Absen,{
    })
    ClaimAbsen: ClaimAbsen
}
