import { inject, injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { UpdateIzinCommand } from './UpdateIzinCommand';
import { TYPES } from '../../infrastructure/types';
import { DataSource } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';

@injectable()
export class UpdateIzinCommandHandler implements ICommandHandler<UpdateIzinCommand> {
  commandToHandle: string = UpdateIzinCommand.name;
  // _db: DataSource;

  constructor(
    @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: UpdateIzinCommand) {
    let cuti = await this._db.getRepository(Izin).findOneByOrFail({
      id: command.id,
    })
    cuti.nidn = command.nidn;
    cuti.tanggal_pengajuan = command.tanggal_pengajuan;
    cuti.tujuan = command.tujuan;

    await this._db.getRepository(Izin).save(cuti);
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