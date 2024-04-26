import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { UpdateCutiCommand } from './UpdateCutiCommand';
import { getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';
import { JenisCuti } from '../../infrastructure/orm/JenisCuti';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class UpdateCutiCommandHandler implements ICommandHandler<UpdateCutiCommand> {
  commandToHandle: string = UpdateCutiCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: UpdateCutiCommand) {
    logger.info({payload:command})
    const _db = await getConnection("default");
    let cuti = await _db.getRepository(Cuti).findOneByOrFail({
      id: command.id,
    })
    if(command.nidn){
      cuti.nidn = command.nidn;
    }
    if(command.nip){
      cuti.nip = command.nip;
    }
    logger.info({cuti:cuti})
    cuti.tanggal_pengajuan = command.tanggal_pengajuan;
    cuti.lama_cuti = command.lama_cuti;
    cuti.tujuan = command.tujuan;
    cuti.JenisCuti = await _db.getRepository(JenisCuti).findOne({where:{
      id:parseInt(command.jenis_cuti)
    }});
    if(command.dokumen !== null)
      cuti.dokumen = command.dokumen

    await _db.getRepository(Cuti).save(cuti);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return cuti;
  }
}