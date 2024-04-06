export class UserEntity {  
    public id:string
    public nama:string
    public level:Array<string>
    public NIDN:string
    public kode_fak:string
    public kode_jurusan:string
    public kode_prodi:string

    constructor (
      id:string,
      nama:string,
      level:Array<string>,
      NIDN:string,
      kode_fak:string,
      kode_jurusan:string,
      kode_prodi:string,
    ) {
      this.id = id
      this.nama = nama
      this.level = level
      this.NIDN = NIDN
      this.kode_fak = kode_fak
      this.kode_jurusan = kode_jurusan
      this.kode_prodi = kode_prodi
      Error.captureStackTrace(this, this.constructor);
    }
    statusCode() {
        return 500
    }
}