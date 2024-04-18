import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateJenisIzinCommand } from './CreateJenisIzinCommand';
import { getConnection } from 'typeorm';
import { JenisIzin } from '../../infrastructure/orm/JenisIzin';

@injectable()
export class CreateJenisIzinCommandHandler implements ICommandHandler<CreateJenisIzinCommand> {
  commandToHandle: string = CreateJenisIzinCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: CreateJenisIzinCommand) {
    const _db = await getConnection("default");
    let jenis_izin  = new JenisIzin();
    jenis_izin.nama = command.nama

    await _db.getRepository(JenisIzin).save(jenis_izin);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return jenis_izin;
  }
}