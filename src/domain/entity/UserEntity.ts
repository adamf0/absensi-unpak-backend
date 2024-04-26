export class UserEntity {  
    public id:string
    public nama:string
    public level:Array<string>
    public NIDN:string|null = null
    public nip:string|null = null
    public kode_fak:string|null = null
    public kode_jurusan:string|null = null
    public kode_prodi:string|null = null

    constructor (
      id:string,
      nama:string,
      level:Array<string>,
      NIDN:string|null = null,
      nip:string|null = null,
      kode_fak:string|null = null,
      kode_jurusan:string|null = null,
      kode_prodi:string|null = null,
    ) {
      this.id = id
      this.nama = nama
      this.level = level
      this.NIDN = NIDN
      this.nip = nip
      this.kode_fak = kode_fak
      this.kode_jurusan = kode_jurusan
      this.kode_prodi = kode_prodi
      // Error.captureStackTrace(this, this.constructor);
    }
    // statusCode() {
    //     return 500
    // }
}