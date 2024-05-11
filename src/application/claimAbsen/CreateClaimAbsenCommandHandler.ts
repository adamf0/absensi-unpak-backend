import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { getConnection } from 'typeorm';
import { logger } from '../../infrastructure/config/logger';
import { ClaimAbsen } from '../../infrastructure/orm/ClaimAbsen';
import { Absen } from '../../infrastructure/orm/Absen';
import { CreateClaimAbsenCommand } from './CreateClaimAbsenCommand';

@injectable()
export class CreateClaimAbsenCommandHandler implements ICommandHandler<CreateClaimAbsenCommand> {
  commandToHandle: string = CreateClaimAbsenCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: CreateClaimAbsenCommand) {
    logger.info({payload:command})
    const _db = await getConnection("default");
    let claimAbsen  = new ClaimAbsen();
    logger.info({claimAbsen:claimAbsen})
    
    claimAbsen.Absen = await _db.getRepository(Absen).findOne({where:{
      id:parseInt(command.absenId)
    }});
    claimAbsen.catatan = command.catatan;
    if(command.dokumen !== null)
      claimAbsen.dokumen = command.dokumen
    if(command.absen_masuk !== null || command.absen_masuk !== "")
      claimAbsen.perbaikan_absen_masuk = command.absen_masuk
    if(command.absen_keluar !== null || command.absen_keluar !== "")
      claimAbsen.perbaikan_absen_keluar = command.absen_keluar
    claimAbsen.status = "menunggu"

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