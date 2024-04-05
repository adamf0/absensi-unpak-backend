import { inject, injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { TYPES } from '../../infrastructure/types';
import { GetUserQuery } from './GetUserQuery';
import { DataSource, getConnection } from 'typeorm';
import { User } from '../../infrastructure/orm/User';

@injectable()
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery, any> {
  queryToHandle = GetUserQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetUserQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(User).findOneByOrFail({
        id: query.id
    })
  }
}
