import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { getConnection } from 'typeorm';
import { SPPD } from '../../infrastructure/orm/SPPD';
import { UpdateSPPDCommand } from './UpdateSPPDCommand';
import { SPPDAnggota } from '../../infrastructure/orm/SPPDAnggota';

@injectable()
export class UpdateSPPDCommandHandler implements ICommandHandler<UpdateSPPDCommand> {
  commandToHandle: string = UpdateSPPDCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: UpdateSPPDCommand) {
    const _db = await getConnection("default");
    let sppd = await _db.getRepository(SPPD).findOneByOrFail({
      id: command.id,
    })
    sppd.nidn = command.nidn;
    sppd.nip = command.nip;
    sppd.jenisSppdId = parseInt(command.jenis_sppd);
    sppd.tujuan = command.tujuan;
    sppd.tanggal_berangkat = command.tanggal_berangkat;
    sppd.tanggal_kembali = command.tanggal_kembali;
    sppd.keterangan = command.keterangan;
    await _db.getRepository(SPPD).save(sppd);

    const anggotaMap: { [key: string]: SPPDAnggota } = {};

    await Promise.all(command.anggota.map(async (anggotaData:any) => {
        const { nidn, nip } = anggotaData;
        const existingAnggota = await _db.getRepository(SPPDAnggota).findOne({ where: [{ nip },{ nidn }] });
        if (existingAnggota) {
            existingAnggota.nidn = nidn??"";
            existingAnggota.nip = nip??"";
            anggotaMap[nidn??nip] = existingAnggota;
        } else {
            const sppdAnggota = new SPPDAnggota();
            sppdAnggota.nidn = nidn??"";
            sppdAnggota.nip = nip??"";
            sppdAnggota.sppd = sppd;
            anggotaMap[sppdAnggota.nip??sppdAnggota.nidn] = sppdAnggota;
        }
    }));

    await _db.getRepository(SPPDAnggota).save(Object.values(anggotaMap));

    const oldAnggotaList = await _db.getRepository(SPPDAnggota).find({ where: { sppdId: sppd.id } });
    const deletePromises = oldAnggotaList
        .filter(oldAnggota => !(oldAnggota.nip in anggotaMap))
        .map(oldAnggota => _db.getRepository(SPPDAnggota).remove(oldAnggota));

    await Promise.all(deletePromises);
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