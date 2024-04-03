import { inject, injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { TYPES } from '../../infrastructure/types';
import { GetAllAbsenByNIDNYearMonthQuery } from './GetAllAbsenByNIDNYearMonthQuery';
import { DataSource, Like, getConnection } from 'typeorm';
import { AppDataSource } from '../../infrastructure/config/mysql';
import { Absen } from '../../infrastructure/orm/Absen';

@injectable()
export class GetAllAbsenByNIDNYearMonthQueryHandler implements IQueryHandler<GetAllAbsenByNIDNYearMonthQuery, any> {
  queryToHandle = GetAllAbsenByNIDNYearMonthQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllAbsenByNIDNYearMonthQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(Absen).find({
      where:{
        nidn: query.nidn,
        tanggal: Like(`%${query.year_month}%`),
      }
    })
  }
}
