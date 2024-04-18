import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { getConnection } from 'typeorm';
import { JenisIzin } from '../../infrastructure/orm/JenisIzin';
import { UpdateJenisIzinCommand } from './UpdateJenisIzinCommand';

@injectable()
export class UpdateJenisIzinCommandHandler implements ICommandHandler<UpdateJenisIzinCommand> {
  commandToHandle: string = UpdateJenisIzinCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: UpdateJenisIzinCommand) {
    const _db = await getConnection("default");
    let jenis_izin = await _db.getRepository(JenisIzin).findOneByOrFail({
      id: command.id,
    })
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