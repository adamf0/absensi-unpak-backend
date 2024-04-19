import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAbsenByFilterQuery } from './GetAbsenByFilterQuery';
import { Between, getConnection } from 'typeorm';
import { Absen } from '../../infrastructure/orm/Absen';

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
    const _db = await getConnection("default");

    if(query.tanggal_mulai && query.tanggal_berakhir){
      return await _db.getRepository(Absen).findBy({
        nidn: query.nidn,
        tanggal: Between(query.tanggal_mulai, query.tanggal_berakhir)
      })
    } else if(query.tanggal_mulai){
      return await _db.getRepository(Absen).findBy({
        nidn: query.nidn,
        tanggal: query.tanggal_mulai
      })
    } else{
      return await _db.getRepository(Absen).findBy({
        nidn: query.nidn
      })
    }
  }
}
