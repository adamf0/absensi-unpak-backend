import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { getConnection } from 'typeorm';
import { logger } from '../../infrastructure/config/logger';
import { UpdateClaimAbsenCommand } from './UpdateClaimAbsenCommand';
import { ClaimAbsen } from '../../infrastructure/orm/ClaimAbsen';
import { Absen } from '../../infrastructure/orm/Absen';

@injectable()
export class UpdateClaimAbsenCommandHandler implements ICommandHandler<UpdateClaimAbsenCommand> {
  commandToHandle: string = UpdateClaimAbsenCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: UpdateClaimAbsenCommand) {
    logger.info({payload:command})
    const _db = await getConnection("default");
    let claimAbsen = await _db.getRepository(ClaimAbsen).findOneByOrFail({
      id: command.id,
    })
    logger.info({claimAbsen:claimAbsen})
    
    claimAbsen.Absen = await _db.getRepository(Absen).findOne({where:{
      id:parseInt(command.absenId)
    }});
    claimAbsen.catatan = command.catatan;
    if(command.dokumen !== null)
      claimAbsen.dokumen = command.dokumen
    claimAbsen.perbaikan_absen_masuk = command.absen_masuk
    claimAbsen.perbaikan_absen_keluar = command.absen_keluar

    await _db.getRepository(ClaimAbsen).save(claimAbsen);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return claimAbsen;
  }
}