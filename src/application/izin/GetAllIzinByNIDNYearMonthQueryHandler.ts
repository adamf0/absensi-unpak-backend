import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllIzinByNIDNYearMonthQuery } from './GetAllIzinByNIDNYearMonthQuery';
import { Like, getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';

@injectable()
export class GetAllIzinByNIDNYearMonthQueryHandler implements IQueryHandler<GetAllIzinByNIDNYearMonthQuery, any> {
  queryToHandle = GetAllIzinByNIDNYearMonthQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllIzinByNIDNYearMonthQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(Izin).find({
      where:{
        nidn: query.nidn,
        tanggal_pengajuan: Like(`%${query.year_month}%`),
      }
    })
  }
}
