import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateAbsenMasukCommand } from './CreateAbsenMasukCommand';
import { Absen } from '../../infrastructure/orm/Absen';
import { getConnection } from 'typeorm';

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
    const _db = await getConnection("default");
    const absen = await _db.getRepository(Absen).findOneBy({
      nidn: command.nidn,
      tanggal: command.tanggal,
    })
    absen.nidn = command.nidn;
    absen.tanggal = command.tanggal;
    absen.absen_masuk = command.tanggal + " " +command.absen_masuk;
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