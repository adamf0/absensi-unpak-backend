import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateIzinCommand } from './CreateIzinCommand';
import { getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';
import { JenisIzin } from '../../infrastructure/orm/JenisIzin';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class CreateIzinCommandHandler implements ICommandHandler<CreateIzinCommand> {
  commandToHandle: string = CreateIzinCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: CreateIzinCommand) {
    logger.info({payload:command})
    const _db = await getConnection("default");
    let izin  = new Izin();
    if(command.nidn){
      izin.nidn = command.nidn;
    }
    if(command.nip){
      izin.nip = command.nip;
    }
    logger.info({izin:izin})
    izin.tanggal_pengajuan = command.tanggal_pengajuan;
    izin.tujuan = command.tujuan;
    izin.JenisIzin = await _db.getRepository(JenisIzin).findOne({where:{
      id:parseInt(command.jenis_izin)
    }});
    if(command.dokumen !== null)
      izin.dokumen = command.dokumen
    izin.status = "menunggu"

    await _db.getRepository(Izin).save(izin);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return izin;
  }
}