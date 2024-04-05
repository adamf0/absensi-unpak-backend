import { inject, injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { DeleteUserCommand } from './DeleteUserCommand';
import { TYPES } from '../../infrastructure/types';
import { DataSource, getConnection } from 'typeorm';
import { User } from '../../infrastructure/orm/User';

@injectable()
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
  commandToHandle: string = DeleteUserCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: DeleteUserCommand) {
    const _db = await getConnection("default");
    await _db.getRepository(User).delete(command.id)

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