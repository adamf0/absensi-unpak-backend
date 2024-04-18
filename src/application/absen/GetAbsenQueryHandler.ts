import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAbsenQuery } from './GetAbsenQuery';
import { getConnection } from 'typeorm';
import { Absen } from '../../infrastructure/orm/Absen';

@injectable()
export class GetAbsenQueryHandler implements IQueryHandler<GetAbsenQuery, any> {
  queryToHandle = GetAbsenQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAbsenQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(Absen).findOneBy({
        nidn: query.nidn,
        tanggal: query.tanggal,
    })
  }
}
