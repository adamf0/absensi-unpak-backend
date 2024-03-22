import { inject, injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateCutiCommand } from './CreateCutiCommand';
import { Absen } from '../../infrastructure/orm/Absen';
import { AppDataSource } from '../../infrastructure/config/mysql';
import { TYPES } from '../../infrastructure/types';
import { DataSource } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';

@injectable()
export class CreateCutiCommandHandler implements ICommandHandler<CreateCutiCommand> {
  commandToHandle: string = CreateCutiCommand.name;
  _db: DataSource;

  constructor(
    // @inject(TYPES.ApiServer) private readonly _db: AppDataSource
  ) {
    this._db = AppDataSource.initialize();
  }

  async handle(command: CreateCutiCommand) {
    let cuti  = new Cuti();
    cuti.nidn = command.nidn;
    cuti.tanggal_pengajuan = command.tanggal_pengajuan;
    cuti.lama_cuti = command.lama_cuti;
    cuti.tujuan = command.tujuan;
    cuti.jenis_cuti = command.jenis_cuti;

    await this._db.getRepository(Cuti).save(cuti);
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