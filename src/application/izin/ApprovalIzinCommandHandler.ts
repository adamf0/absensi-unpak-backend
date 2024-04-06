import { inject, injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { ApprovalIzinCommand } from './ApprovalIzinCommand';
import { AppDataSource } from '../../infrastructure/config/mysql';
import { TYPES } from '../../infrastructure/types';
import { DataSource, getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';

@injectable()
export class ApprovalIzinCommandHandler implements ICommandHandler<ApprovalIzinCommand> {
  commandToHandle: string = ApprovalIzinCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: ApprovalIzinCommand) {
    const _db = await getConnection("default");
    let izin = await _db.getRepository(Izin).findOneOrFail({
        where: {
          id: command.id
        },
        relations: {},
    })
    izin.status = command.type
    izin.catatan = command.note

    await _db.getRepository(Izin).save(izin);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return izin;
  }
}