import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { penggunaCreateSchema, penggunaUpdateSchema } from '../../domain/validation/penggunaSchema';
import { CreatePenggunaCommand } from '../../application/pengguna/CreatePenggunaCommand';
import { GetAllPenggunaQuery } from '../../application/pengguna/GetAllPenggunaQuery';
import { GetPenggunaQuery } from '../../application/pengguna/GetPenggunaQuery';
import { UpdatePenggunaCommand } from '../../application/pengguna/UpdatePenggunaCommand';
import { DeletePenggunaCommand } from '../../application/pengguna/DeletePenggunaCommand';

@controller('/pengguna')
export class PenggunaController {
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

        let [data, count] = await this._queryBus.execute(
            new GetAllPenggunaQuery(pageSize, startIndex)
        );
        data.map((d)=>{
            d.dokumen = d.dokumen==null? null:`${req.protocol}://${req.headers.host}/static/pengguna/${d.dokumen}`
        })
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
        let pengguna = await this._queryBus.execute(
            new GetPenggunaQuery(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: null,
            data: pengguna,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/create')
    async store(@request() req: Request, @response() res: Response) {
        await penggunaCreateSchema.validate(req.body, { abortEarly: false })

        const pengguna = await this._commandBus.send(
            new CreatePenggunaCommand(
                req.body.username,
                req.body.password,
                req.body.nama,
                req.body.level,
                req.body.nidn,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil menambahkan pengguna",
            data: pengguna,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/update')
    async update(@request() req: Request, @response() res: Response) {
        await penggunaUpdateSchema.validate(req.body, { abortEarly: false })
        const pengguna = await this._commandBus.send(
            new UpdatePenggunaCommand(
                parseInt(req.body.id),
                req.body.username,
                req.body.password,
                req.body.nama,
                req.body.level,
                req.body.nidn,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil update data pengguna",
            data: pengguna,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpGet('/delete/:id')
    async delete(@request() req: Request, @response() res: Response) {
        const dataPengguna = await this._queryBus.execute(
            new GetPenggunaQuery(parseInt(req.params.id))
        );
        await this._queryBus.execute(
            new DeletePenggunaCommand(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: "berhasil hapus pengguna",
            data: dataPengguna,
            list: null,
            validation: [],
            log: [],
        });
    }
}