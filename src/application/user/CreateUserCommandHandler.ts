import { inject, injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateUserCommand } from './CreateUserCommand';
import { TYPES } from '../../infrastructure/types';
import { DataSource, getConnection } from 'typeorm';
import { User } from '../../infrastructure/orm/User';

@injectable()
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  commandToHandle: string = CreateUserCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: CreateUserCommand) {
    const _db = await getConnection("default");
    let user  = new User();
    user.nama = command.nama;
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