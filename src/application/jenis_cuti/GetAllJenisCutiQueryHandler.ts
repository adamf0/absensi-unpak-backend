import { inject, injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { TYPES } from '../../infrastructure/types';
import { GetAllJenisCutiQuery } from './GetAllJenisCutiQuery';
import { DataSource } from 'typeorm';
import { JenisCuti } from '../../infrastructure/orm/JenisCuti';

@injectable()
export class GetAllJenisCutiQueryHandler implements IQueryHandler<GetAllJenisCutiQuery, any> {
  queryToHandle = GetAllJenisCutiQuery.name;
  // _db: DataSource;

  constructor(
    @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllJenisCutiQuery) {
    return await this._db.getRepository(JenisCuti).find()
  }
}
