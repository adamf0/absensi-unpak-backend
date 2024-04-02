import { inject, injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { DeleteIzinCommand } from './DeleteIzinCommand';
import { TYPES } from '../../infrastructure/types';
import { DataSource } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';

@injectable()
export class DeleteIzinCommandHandler implements ICommandHandler<DeleteIzinCommand> {
  commandToHandle: string = DeleteIzinCommand.name;
  // _db: DataSource;

  constructor(
    @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: DeleteIzinCommand) {
    await this._db.getRepository(Izin).delete(command.id)

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