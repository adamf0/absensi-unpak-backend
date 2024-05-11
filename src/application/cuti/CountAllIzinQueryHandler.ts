import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { CountAllIzinQuery } from './CountAllIzinQuery';
import { Between, FindManyOptions, In, getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class CountAllIzinQueryHandler implements IQueryHandler<CountAllIzinQuery, any> {
  queryToHandle = CountAllIzinQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: CountAllIzinQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");
    let data:FindManyOptions<Izin> = {}
    if(query.nidn){
      data = {
        where: { nidn: query.nidn }
      }
    } else{
      data = {
        where: { nip: query.nip }
      }
    }
        
    if(query.tanggal_mulai && query.tanggal_berakhir){
      data = Object.assign(data, {
        ...data.where,
        tanggal: Between(query.tanggal_mulai, query.tanggal_berakhir)
      })
    } else if(query.tanggal_mulai){
      data = Object.assign({
        ...data.where,
        tanggal: query.tanggal_mulai
      })
    }
    const record = await _db.getRepository(Izin).findAndCount(data)
    logger.info({filter:JSON.stringify(data), izin:JSON.stringify(record)})
    return record
  }
}
