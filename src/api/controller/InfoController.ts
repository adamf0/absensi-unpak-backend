import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { GetAbsenByFilterQuery } from '../../application/absen/GetAbsenByFilterQuery';
import { CountAllCutiQuery } from '../../application/cuti/CountAllCutiQuery';
import { CountAllIzinQuery } from '../../application/cuti/CountAllIzinQuery';
import moment from 'moment';
import 'moment-timezone';

@controller('/info')
export class InfoController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }


    isLate(absen){
        const currentTime = (absen == null ? moment() : moment(absen.absen_masuk)).tz('Asia/Jakarta');
        const absenTime = moment("08:00", 'HH:mm').tz('Asia/Jakarta');
        return currentTime.isAfter(absenTime);
    }

    is8Hour(absen){
        const masuk = moment(absen).tz('Asia/Jakarta')
        return masuk.isAfter(masuk.startOf('day').add(8, 'hours'));
    }

    @httpGet('/')
    async index(@request() req: Request, @response() res: Response) {
        const nidn = String(req.query?.nidn)
        const tanggal_awal = String(req.query?.tanggal_awal)
        const tanggal_akhir = String(req.query?.tanggal_akhir)

        const [listCuti, countCuti] = await this._queryBus.execute(
            new CountAllCutiQuery()
        );
        const [listIzin, countIzin] = await this._queryBus.execute(
            new CountAllIzinQuery()
        );
        const absen = await this._queryBus.execute(
            new GetAbsenByFilterQuery(nidn, ["undefined","null"].includes(tanggal_awal)? null:tanggal_awal, ["undefined","null"].includes(tanggal_akhir)? null:tanggal_akhir)
        );

        res.status(200).json({
            status: 200,
            message: "berhasil mengajukan cuti",
            data: {
                absen:{
                    masuk:absen.filter(a=>a.absen_masuk!=null).length,
                    tidak_masuk:absen.filter(a=>a.absen_masuk==null && a.absen_keluar==null).length,
                    lebih_8jam:absen.filter(a=>this.is8Hour(a)).length,
                    kurang_8jam:absen.filter(a=>!this.is8Hour(a)).length,
                    tepat_waktu:absen.filter(a=>!this.isLate(a)).length,
                    telat:absen.filter(a=>this.isLate(a)).length,
                },
                izin:{
                    total:countIzin,
                    menunggu:listIzin.filter(izin=>izin.status=="menunggu"||izin.status=="").length,
                    tolak:listIzin.filter(izin=>izin.status=="tolak").length,
                    terima:listIzin.filter(izin=>izin.status=="terima").length,
                },
                cuti:{
                    total:countCuti,
                    menunggu:listCuti.filter(cuti=>cuti.status=="menunggu"||cuti.status=="").length,
                    tolak:listCuti.filter(cuti=>cuti.status=="tolak").length,
                    terima:listCuti.filter(cuti=>cuti.status=="terima").length,
                },
            },
            list: null,
            validation: [],
            log: [],
        });
    }
}