import { inject, injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { TYPES } from '../../infrastructure/types';
import { GetAllCutiByNIDNYearMonthQuery } from './GetAllCutiByNIDNYearMonthQuery';
import { DataSource, Like } from 'typeorm';
import { AppDataSource } from '../../infrastructure/config/mysql';
import { Cuti } from '../../infrastructure/orm/Cuti';

@injectable()
export class GetAllCutiByNIDNYearMonthQueryHandler implements IQueryHandler<GetAllCutiByNIDNYearMonthQuery, any> {
  queryToHandle = GetAllCutiByNIDNYearMonthQuery.name;
  // _db: DataSource;

  constructor(
    @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllCutiByNIDNYearMonthQuery) {
    return await this._db.getRepository(Cuti).find({
      where:{
        nidn: query.nidn,
        tanggal_pengajuan: Like(`%${query.year_month}%`),
      },
      relations: {
        JenisCuti: true,
      },
    })
  }
}
