import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
// import { master_calendarCreateSchema, master_calendarUpdateSchema } from '../../domain/validation/master_calendarSchema';
import fs from 'fs';
import { GetAllMasterCalendarQuery } from '../../application/master_calendar/GetAllMasterCalendarQuery';
import { GetMasterCalendarQuery } from '../../application/master_calendar/GetMasterCalendarQuery';
import { CreateMasterCalendarCommand } from '../../application/master_calendar/CreateMasterCalendarCommand';
import { DeleteMasterCalendarCommand } from '../../application/master_calendar/DeleteMasterCalendarCommand';
import { UpdateMasterCalendarCommand } from '../../application/master_calendar/UpdateMasterCalendarCommand';

@controller('/master_calendar')
export class MasterCalendarController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/')
    async index(@request() req: Request, @response() res: Response) {
        let page,pageSize,startIndex,endIndex
        page = req.query?.page==undefined || req.query?.page=="null"? null:parseInt(String(req.query?.page ?? "1"))
        pageSize = req.query?.pageSize==undefined || req.query?.pageSize=="null"? null:parseInt(String(req.query?.pageSize ?? "10"))
        startIndex = (page - 1) * pageSize;
        endIndex = page * pageSize;

        let [data, count] = await this._queryBus.execute(
            new GetAllMasterCalendarQuery(
                pageSize, 
                startIndex, 
            )
        );
        const totalPage = Math.ceil(count / pageSize);
        const nextPage = (page + 1 > totalPage) ? null : page + 1;
        const prevPage = (page - 1 < 1) || (totalPage < page) ? null : page - 1;

        res.status(200).json({
            status: 200,
            message: null,
            data: null,
            list: {
                totalData: count,
                startIndex: startIndex,
                endIndex: endIndex,

                totalPage: totalPage,
                pageSize: pageSize,
                prevPage: prevPage,
                linkprevPage: prevPage !== null ? req.protocol + "://" + req.get('host') + req.originalUrl.replace(/page=\d+/, `page=${prevPage}`) : null,
                currentPage: page,
                linkCurrentPage: req.protocol + "://" + req.get('host') + req.originalUrl,
                nextPage: nextPage,
                linkNextPage: nextPage !== null ? req.protocol + "://" + req.get('host') + req.originalUrl.replace(/page=\d+/, `page=${nextPage}`) : null,
                data: data
            },
            validation: [],
            log: [],
        });
    }

    @httpGet('/:id')
    async detail(@request() req: Request, @response() res: Response) {
        let master_calendar = await this._queryBus.execute(
            new GetMasterCalendarQuery(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: null,
            data: master_calendar,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/create')
    async store(@request() req: Request, @response() res: Response) {
        const master_calendar = await this._commandBus.send(
            new CreateMasterCalendarCommand(
                req.body.tanggal_mulai,
                req.body.tanggal_akhir,
                req.body.keterangan,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil tambah data libur",
            data: master_calendar,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/update')
    async update(@request() req: Request, @response() res: Response) {
        const master_calendar = await this._commandBus.send(
            new UpdateMasterCalendarCommand(
                parseInt(req.body.id),
                req.body.tanggal_mulai,
                req.body.tanggal_akhir,
                req.body.keterangan,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil update data libur",
            data: master_calendar,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpGet('/delete/:id')
    async delete(@request() req: Request, @response() res: Response) {
        const dataMasterCalendar = await this._queryBus.execute(
            new GetMasterCalendarQuery(parseInt(req.params.id))
        );
        await this._commandBus.send(
            new DeleteMasterCalendarCommand(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: "berhasil hapus data libur",
            data: dataMasterCalendar,
            list: null,
            validation: [],
            log: [],
        });
    }
}