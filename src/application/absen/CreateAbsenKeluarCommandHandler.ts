import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateAbsenKeluarCommand } from './CreateAbsenKeluarCommand';
import { Absen } from '../../infrastructure/orm/Absen';
import { getConnection } from 'typeorm';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class CreateAbsenKeluarCommandHandler implements ICommandHandler<CreateAbsenKeluarCommand> {
  commandToHandle: string = CreateAbsenKeluarCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: CreateAbsenKeluarCommand) {
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
      throw new Error("invalid CreateAbsenKeluarCommand")
    }

    logger.info({absen:absen})
    if(absen==null) throw new Error(`data absen ${target} pada tanggal ${command.tanggal} tidak ditemukan`)
    
    absen.absen_keluar = moment(`${command.tanggal} ${command.absen_keluar}:00`).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    absen.catatan_pulang = command.catatan;
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