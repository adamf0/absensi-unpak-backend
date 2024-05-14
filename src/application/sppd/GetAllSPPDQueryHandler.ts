import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllSPPDQuery } from './GetAllSPPDQuery';
import { In, getConnection } from 'typeorm';
import { logger } from '../../infrastructure/config/logger';
import { SPPD } from '../../infrastructure/orm/SPPD';
import { UserSimak } from '../../infrastructure/orm/UserSimak';
import { Pengguna } from '../../infrastructure/orm/Pengguna';
import { Pegawai } from '../../infrastructure/orm/Pegawai';

@injectable()
export class GetAllSPPDQueryHandler implements IQueryHandler<GetAllSPPDQuery, any> {
  queryToHandle = GetAllSPPDQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllSPPDQuery) {
    const _db = await getConnection("default");
    const _simak = await getConnection("simak");
    const _simpeg = await getConnection("simpeg");
    
    logger.info(query)
    if(query.nidn!=null){
      const queryBuilder = await _db.getRepository(SPPD).createQueryBuilder("sppd")
      .leftJoinAndSelect("sppd.jenisSppd", "jenisSppd")
      .leftJoinAndSelect("sppd.anggota", "sppd_anggota")
      .where("sppd.nidn", { nidn: query.nidn })
      // .andWhere("(sppd.nidn LIKE :search OR (sppd_anggota.nidn LIKE :search OR sppd_anggota.nip LIKE :search) OR jenisSppd.nama LIKE :search OR sppd.tujuan LIKE :search OR sppd.tanggal_berangkat LIKE :search OR sppd.tanggal_kembali LIKE :search OR sppd.keterangan LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('sppd.id','DESC')
      .take(query.take)
      .skip(query.skip)
      
      const extractList = (property) => record
                          .flatMap(item => [item[property], ...(item.anggota || []).map(anggota => anggota[property])])
                          .filter(value => value !== null && value !== undefined);
      const updateUserInformation = (item, userList, property) => {
        if (item[property] !== null) {
          const userInfo = userList.find(user => user.userid === item[property]);
          item[property === 'nidn' ? 'Dosen' : 'Pegawai'] = userInfo ? userInfo[property === 'nidn' ? 'Dosen' : 'Pegawai'] : null;
        }
      };

      let count = await queryBuilder.getCount();
      let record = await queryBuilder.getMany();
      const mergedNidnList = extractList('nidn');
      const mergedNipList = extractList('nip');

      const dosenList = await _simak.getRepository(UserSimak).find({ where: { userid: In(mergedNidnList) }, relations: { Dosen:true } })
      const pegawaiList = await _simpeg.getRepository(Pengguna).find({ where: { username: In(mergedNipList) }, relations: { Pegawai:true } })
      
      const updateRecord = (item) => {
        updateUserInformation(item, dosenList, 'nidn');
        updateUserInformation(item, pegawaiList, 'nip');
      
        if (item.anggota && item.anggota.length > 0) {
          item.anggota.forEach(anggota => {
            updateUserInformation(anggota, dosenList, 'nidn');
            updateUserInformation(anggota, pegawaiList, 'nip');
          });
        }
      
        return item;
      };
      record = record.map(updateRecord);

      return {record,count}
    }
    else if(query.nip!=null){
      const queryBuilder = await _db.getRepository(SPPD).createQueryBuilder("sppd")
      .leftJoinAndSelect("sppd.jenisSppd", "jenisSppd")
      .leftJoinAndSelect("sppd.anggota", "sppd_anggota")
      .where("sppd.nip", { nip: query.nip })
      .andWhere("(sppd.nip LIKE :search OR (sppd_anggota.nip LIKE :search OR sppd_anggota.nip LIKE :search) OR jenisSppd.nama LIKE :search OR sppd.tujuan LIKE :search OR sppd.tanggal_berangkat LIKE :search OR sppd.tanggal_kembali LIKE :search OR sppd.keterangan LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('sppd.id','DESC')
      .take(query.take)
      .skip(query.skip)

      const extractList = (property) => record
                          .flatMap(item => [item[property], ...(item.anggota || []).map(anggota => anggota[property])])
                          .filter(value => value !== null && value !== undefined);
      const updateUserInformation = (item, userList, property) => {
        if (item[property] !== null) {
          const userInfo = userList.find(user => user.userid === item[property]);
          item[property === 'nidn' ? 'Dosen' : 'Pegawai'] = userInfo ? userInfo[property === 'nidn' ? 'Dosen' : 'Pegawai'] : null;
        }
      };

      let count = await queryBuilder.getCount();
      let record = await queryBuilder.getMany();
      const mergedNidnList = extractList('nidn');
      const mergedNipList = extractList('nip');

      const dosenList = await _simak.getRepository(UserSimak).find({ where: { userid: In(mergedNidnList) }, relations: { Dosen:true } })
      const pegawaiList = await _simpeg.getRepository(Pengguna).find({ where: { username: In(mergedNipList) }, relations: { Pegawai:true } })
      
      const updateRecord = (item) => {
        updateUserInformation(item, dosenList, 'nidn');
        updateUserInformation(item, pegawaiList, 'nip');
      
        if (item.anggota && item.anggota.length > 0) {
          item.anggota.forEach(anggota => {
            updateUserInformation(anggota, dosenList, 'nidn');
            updateUserInformation(anggota, pegawaiList, 'nip');
          });
        }
      
        return item;
      };
      record = record.map(updateRecord);

      return {record,count}
    } else{
      const queryBuilder = await _db.getRepository(SPPD).createQueryBuilder("sppd")
        .leftJoinAndSelect("sppd.jenisSppd", "jenisSppd")
        .leftJoinAndSelect("sppd.anggota", "sppd_anggota")
        .andWhere("(sppd.nip LIKE :search OR sppd.nidn LIKE :search OR (sppd_anggota.nidn LIKE :search OR sppd_anggota.nip LIKE :search) OR jenisSppd.nama LIKE :search OR sppd.tujuan LIKE :search OR sppd.tanggal_berangkat LIKE :search OR sppd.tanggal_kembali LIKE :search OR sppd.keterangan LIKE :search)", { search: `%${query.search??""}%` })
        .orderBy('sppd.id','DESC')
        .take(query.take)
        .skip(query.skip)

      const extractList = (property) => record
                          .flatMap(item => [item[property], ...(item.anggota || []).map(anggota => anggota[property])])
                          .filter(value => value !== null && value !== undefined);
      const updateUserInformation = (item, userList, property) => {
        if (item[property] !== null) {
          const userInfo = userList.find(user => user.userid === item[property]);
          item[property === 'nidn' ? 'Dosen' : 'Pegawai'] = userInfo ? userInfo[property === 'nidn' ? 'Dosen' : 'Pegawai'] : null;
        }
      };

      let count = await queryBuilder.getCount();
      let record = await queryBuilder.getMany();
      const mergedNidnList = extractList('nidn');
      const mergedNipList = extractList('nip');

      const dosenList = await _simak.getRepository(UserSimak).find({ where: { userid: In(mergedNidnList) }, relations: { Dosen:true } })
      const pegawaiList = await _simpeg.getRepository(Pengguna).find({ where: { username: In(mergedNipList) }, relations: { Pegawai:true } })
      
      const updateRecord = (item) => {
        updateUserInformation(item, dosenList, 'nidn');
        updateUserInformation(item, pegawaiList, 'nip');
      
        if (item.anggota && item.anggota.length > 0) {
          item.anggota.forEach(anggota => {
            updateUserInformation(anggota, dosenList, 'nidn');
            updateUserInformation(anggota, pegawaiList, 'nip');
          });
        }
      
        return item;
      };
      record = record.map(updateRecord);

      return {record,count}
    }
  }
}
