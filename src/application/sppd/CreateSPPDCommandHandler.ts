import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateSPPDCommand } from './CreateSPPDCommand';
import { getConnection } from 'typeorm';
import { SPPD } from '../../infrastructure/orm/SPPD';
import { SPPDAnggota } from '../../infrastructure/orm/SPPDAnggota';

@injectable()
export class CreateSPPDCommandHandler implements ICommandHandler<CreateSPPDCommand> {
  commandToHandle: string = CreateSPPDCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: CreateSPPDCommand) {
    const _db               = await getConnection("default");
    let sppd                = new SPPD();
    sppd.nidn               = command.nidn;
    sppd.nip                = command.nip;
    sppd.jenisSppdId        = parseInt(command.jenis_sppd);
    sppd.tujuan             = command.tujuan;
    sppd.tanggal_berangkat  = command.tanggal_berangkat;
    sppd.tanggal_kembali    = command.tanggal_kembali;
    sppd.keterangan         = command.keterangan;
    await _db.getRepository(SPPD).save(sppd);

    const anggotaList = command.anggota.map((anggota: any) => {
        const sppdAnggota = new SPPDAnggota();
        sppdAnggota.nidn = anggota.nidn;
        sppdAnggota.nip = anggota.nip;
        sppdAnggota.sppd = sppd;
        return sppdAnggota;
    });

    await _db.getRepository(SPPDAnggota).save(anggotaList);
    
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return sppd;
  }
}