import { inject, injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { DeleteCutiCommand } from './DeleteCutiCommand';
import { Absen } from '../../infrastructure/orm/Absen';
import { AppDataSource } from '../../infrastructure/config/mysql';
import { TYPES } from '../../infrastructure/types';
import { DataSource } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';

@injectable()
export class DeleteCutiCommandHandler implements ICommandHandler<DeleteCutiCommand> {
  commandToHandle: string = DeleteCutiCommand.name;
  _db: DataSource;

  constructor(
    // @inject(TYPES.ApiServer) private readonly _db: AppDataSource
  ) {
    this._db = AppDataSource.initialize();
  }

  async handle(command: DeleteCutiCommand) {
    await this._db.getRepository(Cuti).delete(command.id)

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