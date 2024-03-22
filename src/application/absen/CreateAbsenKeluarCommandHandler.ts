import { inject, injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateAbsenKeluarCommand } from './CreateAbsenKeluarCommand';
import { Absen } from '../../infrastructure/orm/Absen';
import { AppDataSource } from '../../infrastructure/config/mysql';
import { TYPES } from '../../infrastructure/types';
import { DataSource } from 'typeorm';

@injectable()
export class CreateAbsenKeluarCommandHandler implements ICommandHandler<CreateAbsenKeluarCommand> {
  commandToHandle: string = CreateAbsenKeluarCommand.name;
  _db: DataSource;

  constructor(
    // @inject(TYPES.ApiServer) private readonly _db: AppDataSource
  ) {
    this._db = AppDataSource.initialize();
  }

  async handle(command: CreateAbsenKeluarCommand) {
    const absen = await this._db.getRepository(Absen).findOneBy({
        nidn: command.nidn,
        tanggal: command.tanggal,
    })
    absen.absen_keluar = command.absen_keluar;
    await this._db.getRepository(Absen).save(absen);

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