import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllJenisIzinQuery } from './GetAllJenisIzinQuery';
import { getConnection } from 'typeorm';
import { JenisIzin } from '../../infrastructure/orm/JenisIzin';

@injectable()
export class GetAllJenisIzinQueryHandler implements IQueryHandler<GetAllJenisIzinQuery, any> {
  queryToHandle = GetAllJenisIzinQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllJenisIzinQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(JenisIzin).find()
  }
}
