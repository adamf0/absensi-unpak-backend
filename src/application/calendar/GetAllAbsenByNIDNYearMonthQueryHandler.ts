import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllAbsenByNIDNYearMonthQuery } from './GetAllAbsenByNIDNYearMonthQuery';
import { FindManyOptions, Like, getConnection } from 'typeorm';
import { Absen } from '../../infrastructure/orm/Absen';
import { logger } from '../../infrastructure/config/logger';

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
    logger.info({payload:query})
    const _db = await getConnection("default");
    const data:FindManyOptions<Absen> = {}
    if(query.nidn){
      const filter = {...data, where:{
        nidn: query.nidn,
        tanggal: Like(`%${query.year_month}%`),
      }}
      const record = await _db.getRepository(Absen).find(filter)
      logger.info({filter:filter, cuti:record})
      return record
    } else if(query.nip){
      const filter = {...data, where:{
        nip: query.nip,
        tanggal: Like(`%${query.year_month}%`),
      }}
      const record = await _db.getRepository(Absen).find(filter)
      logger.info({filter:filter, cuti:record})
      return record
    } else{
      throw new Error("invalid GetAllAbsenByNIDNYearMonthQuery")
    }
  }
}
