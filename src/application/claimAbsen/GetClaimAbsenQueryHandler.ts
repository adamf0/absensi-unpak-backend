import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetClaimAbsenQuery } from './GetClaimAbsenQuery';
import { getConnection } from 'typeorm';
import { ClaimAbsen } from '../../infrastructure/orm/ClaimAbsen';

@injectable()
export class GetClaimAbsenQueryHandler implements IQueryHandler<GetClaimAbsenQuery, any> {
  queryToHandle = GetClaimAbsenQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetClaimAbsenQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(ClaimAbsen).findOneOrFail({
        where: {
          id: query.id
        },
        relations: {
          Absen: true,
        },
    })
  }
}
