import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllIzinByNIDNYearMonthQuery } from './GetAllIzinByNIDNYearMonthQuery';
import { FindManyOptions, Like, getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';
import { logger } from '../../infrastructure/config/logger';

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
    logger.info({payload:query})
    const _db = await getConnection("default");
    const data:FindManyOptions<Izin> = {}
    if(query.nidn){
      const filter = {...data, where:{
        nidn: query.nidn,
        tanggal_pengajuan: Like(`%${query.year_month}%`),
      }}
      const record = await _db.getRepository(Izin).find(filter)
      logger.info({filter:JSON.stringify(filter), cuti:JSON.stringify(record)})
      return record
    } else if(query.nip){
      const filter = {...data, where:{
        nip: query.nip,
        tanggal_pengajuan: Like(`%${query.year_month}%`),
      }}
      const record = await _db.getRepository(Izin).find(filter)
      logger.info({filter:JSON.stringify(filter), cuti:JSON.stringify(record)})
      return record
    } else{
      throw new Error("invalid GetAllIzinByNIDNYearMonthQuery")
    }
  }
}
