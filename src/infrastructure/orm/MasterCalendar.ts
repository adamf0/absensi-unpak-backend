import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm"

@Entity("master_calendar")
export class MasterCalendar {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column("date")
    tanggal_mulai: string
    
    @Column("date",{nullable: true})
    tanggal_akhir: string

    @Column({type: "text"})
    keterangan: string
}
