import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { CreateIzinCommand } from '../../application/izin/CreateIzinCommand';
import { UpdateIzinCommand } from '../../application/izin/UpdateIzinCommand';
import { DeleteIzinCommand } from '../../application/izin/DeleteIzinCommand';
import { GetAllIzinQuery } from '../../application/izin/GetAllIzinQuery';
import { GetIzinQuery } from '../../application/izin/GetIzinQuery';
import { izinCreateSchema, izinUpdateSchema } from '../../domain/validation/izinSchema';

@controller('/izin')
export class IzinController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/')
    async index(@request() req: Request, @response() res: Response) {
        const page = parseInt(String(req.query?.page ?? "1"));
        const pageSize = parseInt(String(req.query?.pageSize ?? "10"));
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;

        const [data, count] = await this._queryBus.execute(
            new GetAllIzinQuery(pageSize, startIndex)
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
        const izin = await this._queryBus.execute(
            new GetIzinQuery(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: null,
            data: izin,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/create')
    async store(@request() req: Request, @response() res: Response) {
        await izinCreateSchema.validate(req.body, { abortEarly: false });
        const izin = await this._commandBus.send(
            new CreateIzinCommand(
                req.body.nidn,
                req.body.tanggal_pengajuan,
                req.body.tujuan,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil mengajukan izin",
            data: izin,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/update')
    async update(@request() req: Request, @response() res: Response) {
        console.log(req.body)
        await izinUpdateSchema.validate(req.body, { abortEarly: false });

        const izin = await this._commandBus.send(
            new UpdateIzinCommand(
                parseInt(req.body.id),
                req.body.nidn,
                req.body.tanggal_pengajuan,
                req.body.tujuan,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil update data izin",
            data: izin,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpGet('/delete/:id')
    async delete(@request() req: Request, @response() res: Response) {
        const izin = await this._commandBus.send(
            new DeleteIzinCommand(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: "berhasil hapus pengajuan izin",
            data: izin,
            list: null,
            validation: [],
            log: [],
        });
    }
}