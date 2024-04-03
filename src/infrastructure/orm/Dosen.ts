import "reflect-metadata"
import { Entity, Column, Index, PrimaryColumn } from "typeorm"

@Entity("m_dosen")
export class Dosen {

    @PrimaryColumn({length: 50, type: "varchar"})
    NIDN: string

    @Column({length: 9, type: "char"})
    kode_fak: string

    @Column({length: 5, type: "char"})
    kode_jurusan: string

    @Column({length: 10, type: "char"})
    kode_prodi: string

    @Column({length: 50, type: "varchar"})
    nama_dosen: string

}
