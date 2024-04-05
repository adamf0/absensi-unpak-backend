import { inject, injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { TYPES } from '../../infrastructure/types';
import { GetAllUserQuery } from './GetAllUserQuery';
import { DataSource, getConnection } from 'typeorm';
import { User } from '../../infrastructure/orm/User';

@injectable()
export class GetAllUserQueryHandler implements IQueryHandler<GetAllUserQuery, any> {
  queryToHandle = GetAllUserQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllUserQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(User).findAndCount(
        {
            // where: { name: Like('%' + keyword + '%') }, order: { name: "DESC" },
            take: query.take,
            skip: query.skip
        }
    )
  }
}
