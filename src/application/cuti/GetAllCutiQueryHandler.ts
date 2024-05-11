import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllCutiQuery } from './GetAllCutiQuery';
import { FindManyOptions, IsNull, Like, Not, getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class GetAllCutiQueryHandler implements IQueryHandler<GetAllCutiQuery, any> {
  queryToHandle = GetAllCutiQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllCutiQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");

    if(query.nidn!=null){
      const queryBuilder = await _db.getRepository(Cuti).createQueryBuilder("cuti")
      .where("cuti.nidn = :nidn", { nidn: query.nidn })
      .andWhere("(nip LIKE :search OR tanggal_pengajuan LIKE :search OR tujuan LIKE :search OR dokumen LIKE :search OR status LIKE :search OR catatan LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('id','DESC')
      .take(query.take)
      .skip(query.skip)

      const record = queryBuilder.getManyAndCount();
      logger.info({filter:queryBuilder.getQueryAndParameters(), cuti:JSON.stringify(record)})
      return record
    }
    else if(query.nip!=null){
      const queryBuilder = await _db.getRepository(Cuti).createQueryBuilder("cuti")
      .where("nip = :nip", { nip: query.nip })
      .andWhere("(nidn LIKE :search OR tanggal_pengajuan LIKE :search OR tujuan LIKE :search OR dokumen LIKE :search OR status LIKE :search OR catatan LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('id','DESC')
      .take(query.take)
      .skip(query.skip)

      const record = queryBuilder.getManyAndCount();
      logger.info({filter:queryBuilder.getQueryAndParameters(), cuti:JSON.stringify(record)})
      return record
    } else{
      const queryBuilder = await _db.getRepository(Cuti).createQueryBuilder("cuti")
      .where("(nidn LIKE :search OR nip LIKE :search OR tanggal_pengajuan LIKE :search OR tujuan LIKE :search OR dokumen LIKE :search OR status LIKE :search OR catatan LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('id','DESC')
      .take(query.take)
      .skip(query.skip)

      const record = queryBuilder.getManyAndCount();
      logger.info({filter:queryBuilder.getQueryAndParameters(), cuti:JSON.stringify(record)})
      return record
    }
  }
}
