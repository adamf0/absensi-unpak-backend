import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { UpdatePenggunaCommand } from './UpdatePenggunaCommand';
import { getConnection } from 'typeorm';
import { User } from '../../infrastructure/orm/User';

@injectable()
export class UpdatePenggunaCommandHandler implements ICommandHandler<UpdatePenggunaCommand> {
  commandToHandle: string = UpdatePenggunaCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: UpdatePenggunaCommand) {
    const _db = await getConnection("default");
    let pengguna = await _db.getRepository(User).findOneByOrFail({
      id: command.id,
    })
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