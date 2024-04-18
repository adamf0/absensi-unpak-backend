import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { getConnection } from 'typeorm';
import { JenisIzin } from '../../infrastructure/orm/JenisIzin';
import { DeleteJenisIzinCommand } from './DeleteJenisIzinCommand';

@injectable()
export class DeleteJenisIzinCommandHandler implements ICommandHandler<DeleteJenisIzinCommand> {
  commandToHandle: string = DeleteJenisIzinCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: DeleteJenisIzinCommand) {
    const _db = await getConnection("default");
    await _db.getRepository(JenisIzin).delete(command.id)

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