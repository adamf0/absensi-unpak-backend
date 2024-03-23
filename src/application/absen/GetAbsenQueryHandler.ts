import { inject, injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { TYPES } from '../../infrastructure/types';
import { GetAbsenQuery } from './GetAbsenQuery';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../infrastructure/config/mysql';
import { Absen } from '../../infrastructure/orm/Absen';

@injectable()
export class GetAbsenQueryHandler implements IQueryHandler<GetAbsenQuery, any> {
  queryToHandle = GetAbsenQuery.name;
  // _db: DataSource;

  constructor(
    @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAbsenQuery) {
    return await this._db.getRepository(Absen).findOneByOrFail({
        nidn: query.nidn,
        tanggal: query.tanggal,
    })
  }
}
