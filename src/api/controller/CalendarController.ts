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

@controller('/calendar')
export class CalendarController {
  constructor(
    @inject(TYPES.Log) private readonly _log: ILog,
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
  ) {}

  @httpGet('/:nidn/:year_month')
  async absen(@request() req: Request, @response() res: Response) {
      try {
        const list_absen = await this._queryBus.execute(
            new GetAllAbsenByNIDNYearMonthQuery(req.params.nidn,req.params.year_month)
        );

        const list_cuti = await this._queryBus.execute(
            new GetAllCutiByNIDNYearMonthQuery(req.params.nidn,req.params.year_month)
        );

        const result = [...list_cuti.reduce((acc, item) => {
                        for (let i = 0; i < item.lama_cuti; i++) {
                            const cutiObj = {
                                id: item.id,
                                tanggal: new Date(new Date(item.tanggal_pengajuan).getTime() + (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                                type: "cuti",
                                tujuan: item.tujuan,
                                jenis_cuti: item.jenis_cuti
                            };
                            acc.push(cutiObj);
                        }
                        return acc;
                    }, []), ...list_absen.map(item => ({
                        id: item.id,
                        tanggal: new Date(item.tanggal).toISOString().split('T')[0],
                        type: "absen",
                        absen_masuk: item.absen_masuk,
                        absen_keluar: item.absen_keluar
                    }))
        ];

        const resultSortedAsc = result.sort((a, b) => {
            return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
        });
        
        res.status(200).json({
            status: 200,
            message: resultSortedAsc.length==0? "data tidak ditemukan":"data ditemukan",
            data: null,
            list: resultSortedAsc,
            validation: [],
            log: [],
        });
    } catch (error) {
        console.error(error.constructor);
        if (error instanceof QueryFailedError) {
            if(process.env.deploy != "dev"){
                this._log.saveLog(error.driverError);
            }
            res.status(500).json({
                status: 500,
                message: "error server",
                data: null,
                list: null,
                validation: [],
                log: process.env.deploy == "dev" ? error.driverError : "error server",
            });
        } else {
            if(error.name.IsNull){
                if(process.env.deploy != "dev"){
                    this._log.saveLog(error.message);
                }
                res.status(500).json({
                    status: 500,
                    message: error.message,
                    data: null,
                    list: null,
                    validation: [],
                    log: [],
                });
            } else{
                if(process.env.deploy != "dev"){
                    this._log.saveLog(JSON.stringify(error?.message??[]));
                }
                res.status(500).json({
                    status: 500,
                    message: null,
                    data: null,
                    list: null,
                    validation: error?.message??[],
                    log: [],
                });
            }
        }
    }
  }
}