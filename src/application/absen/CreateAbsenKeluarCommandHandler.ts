import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateAbsenKeluarCommand } from './CreateAbsenKeluarCommand';
import { Absen } from '../../infrastructure/orm/Absen';
import { getConnection } from 'typeorm';

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
    const _db = await getConnection("default");
    const absen = await _db.getRepository(Absen).findOneBy({
        nidn: command.nidn,
        tanggal: command.tanggal,
    })
    absen.absen_keluar = command.tanggal + " " + command.absen_keluar;
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