import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateJenisSPPDCommand } from './CreateJenisSPPDCommand';
import { getConnection } from 'typeorm';
import { JenisSPPD } from '../../infrastructure/orm/JenisSPPD';

@injectable()
export class CreateJenisSPPDCommandHandler implements ICommandHandler<CreateJenisSPPDCommand> {
  commandToHandle: string = CreateJenisSPPDCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: CreateJenisSPPDCommand) {
    const _db = await getConnection("default");
    let jenis_sppd  = new JenisSPPD();
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