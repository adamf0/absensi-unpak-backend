import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { CountAllIzinQuery } from './CountAllIzinQuery';
import { Between, FindManyOptions, In, getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';

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
    const _db = await getConnection("default");
    let data: FindManyOptions<Izin> = {
      where: { nidn: query.nidn }
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
    return await _db.getRepository(Izin).findAndCount(data)
  }
}
