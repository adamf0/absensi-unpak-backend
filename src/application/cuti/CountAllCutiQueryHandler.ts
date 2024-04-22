import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { CountAllCutiQuery } from './CountAllCutiQuery';
import { Between, FindManyOptions, In, getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';

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
    const _db = await getConnection("default");
    let data: FindManyOptions<Cuti> = {
      where: { nidn: query.nidn }
    }
    if(query.tanggal_mulai && query.tanggal_berakhir){
      data = Object.assign(data, {
        ...data.where,
        tanggal: Between(query.tanggal_mulai, query.tanggal_berakhir)
      })
    }
    return await _db.getRepository(Cuti).findAndCount(data)
  }
}
