import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllMasterCalendarQuery } from './GetAllMasterCalendarQuery';
import { getConnection } from 'typeorm';
import { MasterCalendar } from '../../infrastructure/orm/MasterCalendar';

@injectable()
export class GetAllMasterCalendarQueryHandler implements IQueryHandler<GetAllMasterCalendarQuery, any> {
  queryToHandle = GetAllMasterCalendarQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllMasterCalendarQuery) {
    const _db = await getConnection("default");
    return await (query.take == null && query.skip == null? 
      _db.getRepository(MasterCalendar).find():
      _db.getRepository(MasterCalendar).findAndCount(
        {
          // where: { name: Like('%' + keyword + '%') }, order: { name: "DESC" },
          take: query.take,
          skip: query.skip,
        },
      )
    )
  }
}
