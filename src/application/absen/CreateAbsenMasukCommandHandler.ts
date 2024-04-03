import { inject, injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateAbsenMasukCommand } from './CreateAbsenMasukCommand';
import { Absen } from '../../infrastructure/orm/Absen';
import { AppDataSource } from '../../infrastructure/config/mysql';
import { TYPES } from '../../infrastructure/types';
import { DataSource, getConnection } from 'typeorm';

@injectable()
export class CreateAbsenMasukCommandHandler implements ICommandHandler<CreateAbsenMasukCommand> {
  commandToHandle: string = CreateAbsenMasukCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: CreateAbsenMasukCommand) {
    const _db = await getConnection("default");
    const absen = new Absen();
    absen.nidn = command.nidn;
    absen.tanggal = command.tanggal;
    absen.absen_masuk = command.tanggal + " " +command.absen_masuk;
    await _db.getRepository(Absen).save(absen);

    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return absen;
  }
}