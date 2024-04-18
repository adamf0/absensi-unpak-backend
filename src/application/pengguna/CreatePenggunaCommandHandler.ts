import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreatePenggunaCommand } from './CreatePenggunaCommand';
import { getConnection } from 'typeorm';
import { User } from '../../infrastructure/orm/User';

@injectable()
export class CreatePenggunaCommandHandler implements ICommandHandler<CreatePenggunaCommand> {
  commandToHandle: string = CreatePenggunaCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: CreatePenggunaCommand) {
    const _db = await getConnection("default");
    let pengguna  = new User();
    pengguna.username = command.username;
    pengguna.password = command.password;
    pengguna.nama = command.nama;
    pengguna.level = command.level;
    pengguna.NIDN = command.nidn;

    await _db.getRepository(User).save(pengguna);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return pengguna;
  }
}