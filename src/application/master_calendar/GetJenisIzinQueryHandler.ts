import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetMasterCalendarQuery } from './GetMasterCalendarQuery';
import { getConnection } from 'typeorm';
import { MasterCalendar } from '../../infrastructure/orm/MasterCalendar';

@injectable()
export class GetMasterCalendarQueryHandler implements IQueryHandler<GetMasterCalendarQuery, any> {
  queryToHandle = GetMasterCalendarQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetMasterCalendarQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(MasterCalendar).findOneOrFail({
        where: {
          id: query.id
        },
    })
  }
}
