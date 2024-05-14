import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { getConnection } from 'typeorm';
import { JenisSPPD } from '../../infrastructure/orm/JenisSPPD';
import { UpdateJenisSPPDCommand } from './UpdateJenisSPPDCommand';

@injectable()
export class UpdateJenisSPPDCommandHandler implements ICommandHandler<UpdateJenisSPPDCommand> {
  commandToHandle: string = UpdateJenisSPPDCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: UpdateJenisSPPDCommand) {
    const _db = await getConnection("default");
    let jenis_sppd = await _db.getRepository(JenisSPPD).findOneByOrFail({
      id: command.id,
    })
    jenis_sppd.nama = command.nama

    await _db.getRepository(JenisSPPD).save(jenis_sppd);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return jenis_sppd;
  }
}