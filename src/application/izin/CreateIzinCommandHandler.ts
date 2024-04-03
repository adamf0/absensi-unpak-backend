import { inject, injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateIzinCommand } from './CreateIzinCommand';
import { TYPES } from '../../infrastructure/types';
import { DataSource, getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';

@injectable()
export class CreateIzinCommandHandler implements ICommandHandler<CreateIzinCommand> {
  commandToHandle: string = CreateIzinCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: CreateIzinCommand) {
    const _db = await getConnection("default");
    let cuti  = new Izin();
    cuti.nidn = command.nidn;
    cuti.tanggal_pengajuan = command.tanggal_pengajuan;
    cuti.tujuan = command.tujuan;

    await _db.getRepository(Izin).save(cuti);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return cuti;
  }
}