import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm"
import { Izin } from "./Izin"

@Entity("jenis_izin")
export class JenisIzin {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column({length: 255, type: "varchar"})
    nama: string

    @OneToMany(() => Izin, cuti => cuti.JenisIzin,{
    })
    izin: Izin[]
}
