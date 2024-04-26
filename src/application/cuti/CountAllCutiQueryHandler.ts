import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { CountAllCutiQuery } from './CountAllCutiQuery';
import { Between, FindManyOptions, In, getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class CountAllCutiQueryHandler implements IQueryHandler<CountAllCutiQuery, any> {
  queryToHandle = CountAllCutiQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: CountAllCutiQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");
    let data:FindManyOptions<Cuti> = {}
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
    }
    const record = await _db.getRepository(Cuti).findAndCount(data)
    logger.info({filter:data, cuti:record})
    return record
  }
}
