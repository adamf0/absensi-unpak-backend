import { inject, injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { UpdateUserCommand } from './UpdateUserCommand';
import { TYPES } from '../../infrastructure/types';
import { DataSource, getConnection } from 'typeorm';
import { User } from '../../infrastructure/orm/User';

@injectable()
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  commandToHandle: string = UpdateUserCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: UpdateUserCommand) {
    const _db = await getConnection("default");
    let user = await _db.getRepository(User).findOneByOrFail({
      id: command.id,
    })
    user.username = command.username;
    user.password = command.password;
    user.level = command.level;

    await _db.getRepository(User).save(user);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return user;
  }
}