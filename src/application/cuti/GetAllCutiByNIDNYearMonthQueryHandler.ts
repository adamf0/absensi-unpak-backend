import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllCutiByNIDNYearMonthQuery } from './GetAllCutiByNIDNYearMonthQuery';
import { FindManyOptions, Like, getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class GetAllCutiByNIDNYearMonthQueryHandler implements IQueryHandler<GetAllCutiByNIDNYearMonthQuery, any> {
  queryToHandle = GetAllCutiByNIDNYearMonthQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllCutiByNIDNYearMonthQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");

    const data:FindManyOptions<Cuti> = {
      relations: {
        JenisCuti: true,
      },
    }
    if(query.nidn){
      const filter = {...data, where:{
        nidn: query.nidn,
        tanggal_mulai: Like(`%${query.year_month}%`),
      }}
      const record = await _db.getRepository(Cuti).find(filter)
      logger.info({filter:JSON.stringify(filter), cuti:JSON.stringify(record)})
      return record
    } else if(query.nip){
      const filter = {...data, where:{
        nip: query.nip,
        tanggal_mulai: Like(`%${query.year_month}%`),
      }}
      const record = await _db.getRepository(Cuti).find(filter)
      logger.info({filter:JSON.stringify(filter), cuti:JSON.stringify(record)})
      return record
    } else{
      throw new Error("invalid GetAllCutiByNIDNYearMonthQuery")
    }
  }
}
