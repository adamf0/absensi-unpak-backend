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
      .leftJoinAndSelect("cuti.JenisCuti", "jenisCuti")
      .where("cuti.nidn = :nidn", { nidn: query.nidn })
      .andWhere("(cuti.nip LIKE :search OR cuti.tanggal_mulai LIKE :search OR cuti.tanggal_akhir LIKE :search OR cuti.tujuan LIKE :search OR cuti.dokumen LIKE :search OR cuti.status LIKE :search OR cuti.catatan LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('cuti.id','DESC')
      .take(query.take)
      .skip(query.skip)

      const record = queryBuilder.getManyAndCount();
      logger.info({filter:queryBuilder.getQueryAndParameters(), cuti:JSON.stringify(record)})
      return record
    }
    else if(query.nip!=null){
      const queryBuilder = await _db.getRepository(Cuti).createQueryBuilder("cuti")
      .leftJoinAndSelect("cuti.JenisCuti", "jenisCuti")
      .where("cuti.nip = :nip", { nip: query.nip })
      .andWhere("(cuti.nidn LIKE :search OR cuti.tanggal_mulai LIKE :search OR cuti.tanggal_akhir LIKE :search OR cuti.tujuan LIKE :search OR cuti.dokumen LIKE :search OR cuti.status LIKE :search OR cuti.catatan LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('cuti.id','DESC')
      .take(query.take)
      .skip(query.skip)

      const record = queryBuilder.getManyAndCount();
      logger.info({filter:queryBuilder.getQueryAndParameters(), cuti:JSON.stringify(record)})
      return record
    } else{
      const queryBuilder = await _db.getRepository(Cuti).createQueryBuilder("cuti")
      .leftJoinAndSelect("cuti.JenisCuti", "jenisCuti")
      .where("(cuti.nidn LIKE :search OR cuti.nip LIKE :search OR cuti.tanggal_mulai LIKE :search OR cuti.tanggal_akhir LIKE :search OR cuti.tujuan LIKE :search OR cuti.dokumen LIKE :search OR cuti.status LIKE :search OR cuti.catatan LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('cuti.id','DESC')
      .take(query.take)
      .skip(query.skip)

      const record = queryBuilder.getManyAndCount();
      logger.info({filter:queryBuilder.getQueryAndParameters(), cuti:JSON.stringify(record)})
      return record
    }
  }
}
