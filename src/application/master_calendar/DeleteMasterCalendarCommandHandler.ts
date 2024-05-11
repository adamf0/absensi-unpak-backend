import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { getConnection } from 'typeorm';
import { MasterCalendar } from '../../infrastructure/orm/MasterCalendar';
import { DeleteMasterCalendarCommand } from './DeleteMasterCalendarCommand';

@injectable()
export class DeleteMasterCalendarCommandHandler implements ICommandHandler<DeleteMasterCalendarCommand> {
  commandToHandle: string = DeleteMasterCalendarCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: DeleteMasterCalendarCommand) {
    const _db = await getConnection("default");
    await _db.getRepository(MasterCalendar).delete(command.id)

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