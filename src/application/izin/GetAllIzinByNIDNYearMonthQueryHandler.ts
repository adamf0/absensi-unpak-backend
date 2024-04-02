import { inject, injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { TYPES } from '../../infrastructure/types';
import { GetAllIzinByNIDNYearMonthQuery } from './GetAllIzinByNIDNYearMonthQuery';
import { DataSource, Like } from 'typeorm';
import { AppDataSource } from '../../infrastructure/config/mysql';
import { Izin } from '../../infrastructure/orm/Izin';

@injectable()
export class GetAllIzinByNIDNYearMonthQueryHandler implements IQueryHandler<GetAllIzinByNIDNYearMonthQuery, any> {
  queryToHandle = GetAllIzinByNIDNYearMonthQuery.name;
  // _db: DataSource;

  constructor(
    @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllIzinByNIDNYearMonthQuery) {
    return await this._db.getRepository(Izin).find({
      where:{
        nidn: query.nidn,
        tanggal_pengajuan: Like(`%${query.year_month}%`),
      }
    })
  }
}
