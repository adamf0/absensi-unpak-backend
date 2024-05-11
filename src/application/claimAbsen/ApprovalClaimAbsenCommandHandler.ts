import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { ApprovalClaimAbsenCommand } from './ApprovalClaimAbsenCommand';
import { getConnection } from 'typeorm';
import { ClaimAbsen } from '../../infrastructure/orm/ClaimAbsen';
import { logger } from '../../infrastructure/config/logger';
import { Absen } from '../../infrastructure/orm/Absen';
import { StatusClaimAbsen } from '../../domain/enum/StatusClaimAbsen';

@injectable()
export class ApprovalClaimAbsenCommandHandler implements ICommandHandler<ApprovalClaimAbsenCommand> {
  commandToHandle: string = ApprovalClaimAbsenCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: ApprovalClaimAbsenCommand) {
    logger.info({payload:command})
    const _db = await getConnection("default");
    let claimAbsen = await _db.getRepository(ClaimAbsen).findOneOrFail({
        where: {
          id: command.id
        },
        relations: {},
    })
    logger.info({claimAbsen:claimAbsen})
    claimAbsen.status = command.type
    await _db.getRepository(ClaimAbsen).save(claimAbsen);

    if(claimAbsen.status==StatusClaimAbsen.Terima){
      let absen = await _db.getRepository(Absen).findOneOrFail({
        where: {
          id: claimAbsen.absenId
        },
        relations: {},
      })
      if(claimAbsen.perbaikan_absen_masuk!=null || claimAbsen.perbaikan_absen_masuk!=""){
        absen.absen_masuk = `${absen.tanggal} ${claimAbsen.perbaikan_absen_masuk}`
      }
      if(claimAbsen.perbaikan_absen_keluar!=null || claimAbsen.perbaikan_absen_keluar!=""){
        absen.absen_keluar = `${absen.tanggal} ${claimAbsen.perbaikan_absen_keluar}`
      }
      await _db.getRepository(Absen).save(absen);
    }

    // let absen = claimAbsen.Absen
    // absen.absen_masuk = claimAbsen.perbaikan_absen_masuk
    // absen.absen_keluar = claimAbsen.perbaikan_absen_keluar
    // await _db.getRepository(Absen).save(absen);
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