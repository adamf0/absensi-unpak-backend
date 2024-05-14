import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { getConnection } from 'typeorm';
import { JenisSPPD } from '../../infrastructure/orm/JenisSPPD';
import { DeleteJenisSPPDCommand } from './DeleteJenisSPPDCommand';

@injectable()
export class DeleteJenisSPPDCommandHandler implements ICommandHandler<DeleteJenisSPPDCommand> {
  commandToHandle: string = DeleteJenisSPPDCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: DeleteJenisSPPDCommand) {
    const _db = await getConnection("default");
    await _db.getRepository(JenisSPPD).delete(command.id)

    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es
  }
}