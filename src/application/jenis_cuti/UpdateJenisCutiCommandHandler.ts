import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { UpdateJenisCutiCommand } from './UpdateJenisCutiCommand';
import { getConnection } from 'typeorm';
import { JenisCuti } from '../../infrastructure/orm/JenisCuti';

@injectable()
export class UpdateJenisCutiCommandHandler implements ICommandHandler<UpdateJenisCutiCommand> {
  commandToHandle: string = UpdateJenisCutiCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: UpdateJenisCutiCommand) {
    const _db = await getConnection("default");
    let jenis_cuti = await _db.getRepository(JenisCuti).findOneByOrFail({
      id: command.id,
    })
    jenis_cuti.nama = command.nama
    jenis_cuti.min = parseInt(command.min)
    jenis_cuti.max = parseInt(command.max)
    jenis_cuti.kondisi = command.kondisi as string
    jenis_cuti.dokumen = command.dokumen

    await _db.getRepository(JenisCuti).save(jenis_cuti);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return jenis_cuti;
  }
}