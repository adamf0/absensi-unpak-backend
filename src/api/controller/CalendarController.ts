import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { QueryFailedError } from 'typeorm';
import { GetAllAbsenByNIDNYearMonthQuery } from '../../application/calendar/GetAllAbsenByNIDNYearMonthQuery';
import { GetAllCutiByNIDNYearMonthQuery } from '../../application/cuti/GetAllCutiByNIDNYearMonthQuery';
import { GetAllIzinByNIDNYearMonthQuery } from '../../application/izin/GetAllIzinByNIDNYearMonthQuery';
import { logger } from '../../infrastructure/config/logger';
import moment from 'moment';

@controller('/calendar')
export class CalendarController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/:type/:nidn_nip/:year_month')
    async absen(@request() req: Request, @response() res: Response) {
        logger.info({payload:req.params})
        const list_absen = await this._queryBus.execute(
            new GetAllAbsenByNIDNYearMonthQuery(
                req.params.type=="nidn"? req.params.nidn_nip:null,
                req.params.type=="nip"? req.params.nidn_nip:null,
                req.params.year_month
            )
        );

        const list_cuti = await this._queryBus.execute(
            new GetAllCutiByNIDNYearMonthQuery(
                req.params.type=="nidn"? req.params.nidn_nip:null,
                req.params.type=="nip"? req.params.nidn_nip:null,
                req.params.year_month
            )
        );

        const list_izin = await this._queryBus.execute(
            new GetAllIzinByNIDNYearMonthQuery(
                req.params.type=="nidn"? req.params.nidn_nip:null,
                req.params.type=="nip"? req.params.nidn_nip:null,
                req.params.year_month
            )
        );
        const result = [
            ...list_cuti.map((item) => ({
                id: item?.id,
                start: moment(item?.tanggal_mulai).tz('Asia/Jakarta').format('YYYY-MM-DD'),
                end: moment(item?.tanggal_akhir).tz('Asia/Jakarta').add(item?.lama_cuti, 'days').format('YYYY-MM-DD'),
                title: item?.tujuan,
                backgroundColor: "#1d4ed8",
			    borderColor: "#1d4ed8",//blue
                // jenis_cuti: item?.JenisCuti?.nama,
            })),
            ...list_absen.map((item) => ({
                id: item?.id,
                start: moment(item?.tanggal).tz('Asia/Jakarta').format('YYYY-MM-DD'),
                end: moment(item?.tanggal).tz('Asia/Jakarta').format('YYYY-MM-DD'),
                title: item?.absen_masuk==null? "Tidak Masuk":(item?.catatan_telat==null? "Masuk":`Telat karena ${item?.catatan_telat}`),
                backgroundColor: item?.absen_masuk==null? "#b91c1c":(item?.catatan_telat==null? "#15803d":`#000`),
			    borderColor: item?.absen_masuk==null? "#b91c1c":(item?.catatan_telat==null? "#15803d":`#000`),
            })), //red green black
            ...list_izin.map((item) => ({
                id: item?.id,
                start: moment(item?.tanggal).tz('Asia/Jakarta').format('YYYY-MM-DD'),
                end: moment(item?.tanggal).tz('Asia/Jakarta').format('YYYY-MM-DD'),
                title: item?.tujuan,
                backgroundColor: "#c2410c",
			    borderColor: "#c2410c", //orange
            })),
        ];

        const resultSortedAsc = result.sort((a, b) => {
            return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
        });

        res.status(200).json({
            status: 200,
            message: resultSortedAsc.length == 0 ? "data tidak ditemukan" : "data ditemukan",
            data: null,
            list: result,
            validation: [],
            log: [],
        });
    }
}