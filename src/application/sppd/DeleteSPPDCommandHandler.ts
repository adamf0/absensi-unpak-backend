import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { getConnection } from 'typeorm';
import { SPPD } from '../../infrastructure/orm/SPPD';
import { DeleteSPPDCommand } from './DeleteSPPDCommand';

@injectable()
export class DeleteSPPDCommandHandler implements ICommandHandler<DeleteSPPDCommand> {
  commandToHandle: string = DeleteSPPDCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: DeleteSPPDCommand) {
    const _db = await getConnection("default");
    await _db.getRepository(SPPD).delete(command.id)

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