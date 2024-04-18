import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { getConnection } from 'typeorm';
import { JenisCuti } from '../../infrastructure/orm/JenisCuti';
import { DeleteJenisCutiCommand } from './DeleteJenisCutiCommand';

@injectable()
export class DeleteJenisCutiCommandHandler implements ICommandHandler<DeleteJenisCutiCommand> {
  commandToHandle: string = DeleteJenisCutiCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: DeleteJenisCutiCommand) {
    const _db = await getConnection("default");
    await _db.getRepository(JenisCuti).delete(command.id)

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