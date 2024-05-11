import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAbsenByFilterQuery } from './GetAbsenByFilterQuery';
import { Between, FindManyOptions, getConnection } from 'typeorm';
import { Absen } from '../../infrastructure/orm/Absen';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class GetAbsenByFilterQueryHandler implements IQueryHandler<GetAbsenByFilterQuery, any> {
  queryToHandle = GetAbsenByFilterQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAbsenByFilterQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");
    let data:FindManyOptions<Absen> = {}
    if(query.nidn){
      data = {
        ...data,
        where: { nidn: query.nidn }
      }
    } else{
      data = {
        ...data,
        where: { nip: query.nip }
      }
    }

    if(query.tanggal_mulai && query.tanggal_berakhir){
      data = {
        ...data,
        where:{
          ...data.where,
          tanggal: Between(query.tanggal_mulai, query.tanggal_berakhir)
        }
      }
    } else if(query.tanggal_mulai){
      data = {
        ...data,
        where:{
          ...data.where,
          tanggal: query.tanggal_mulai
        }
      }
    }
    const record = await _db.getRepository(Absen).findAndCount(data)
    logger.info({filter:JSON.stringify(data), absen:JSON.stringify(record)})
    return record
  }
}
