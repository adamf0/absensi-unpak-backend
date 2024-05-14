import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateAbsenMasukCommand } from './CreateAbsenMasukCommand';
import { Absen } from '../../infrastructure/orm/Absen';
import { getConnection } from 'typeorm';
import { logger } from '../../infrastructure/config/logger';
import moment from 'moment';

@injectable()
export class CreateAbsenMasukCommandHandler implements ICommandHandler<CreateAbsenMasukCommand> {
  commandToHandle: string = CreateAbsenMasukCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: CreateAbsenMasukCommand) {
    logger.info({payload:command})
    const _db = await getConnection("default");
    let absen = null
    let target = null

    if(command.nidn){
      target = command.nidn
      absen = await _db.getRepository(Absen).findOneBy({
        nidn: command.nidn,
        tanggal: command.tanggal,
      })
    } else if(command.nip){
      target = command.nip
      absen = await _db.getRepository(Absen).findOneBy({
        nip: command.nip,
        tanggal: command.tanggal,
      })
    } else{
      throw new Error("invalid CreateAbsenMasukCommand")
    }
    logger.info({absen:absen})
    
    if(absen==null) throw new Error(`data absen ${target} pada tanggal ${command.tanggal} tidak ditemukan`)
    const x = moment(`${command.tanggal} ${command.absen_masuk}`).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
    logger.info({absen_masuk:x})
    
    absen.absen_masuk = x;
    absen.catatan_telat = command.catatan;
    await _db.getRepository(Absen).save(absen);

    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return absen;
  }
}