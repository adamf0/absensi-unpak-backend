import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { CreateJenisSPPDCommand } from '../../application/jenis_sppd/CreateJenisSPPDCommand';
import { DeleteJenisSPPDCommand } from '../../application/jenis_sppd/DeleteJenisSPPDCommand';
import { GetAllJenisSPPDQuery } from '../../application/jenis_sppd/GetAllJenisSPPDQuery';
import { GetJenisSPPDQuery } from '../../application/jenis_sppd/GetJenisSPPDQuery';
import { UpdateJenisSPPDCommand } from '../../application/jenis_sppd/UpdateJenisSPPDCommand';

@controller('/jenis_sppd')
export class JenisSPPDController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/')
    async index(@request() req: Request, @response() res: Response) {
        if(Object.keys(req.query).length > 0){
            const page = parseInt(String(req.query?.page ?? "1"));
            const pageSize = parseInt(String(req.query?.pageSize ?? "10"));
            const startIndex = (page - 1) * pageSize;
            const endIndex = page * pageSize;

            let [data, count] = await this._queryBus.execute(
                new GetAllJenisSPPDQuery(pageSize, startIndex)
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
        } else{
            let list = await this._queryBus.execute(
                new GetAllJenisSPPDQuery()
            );
            list.map(d=>d.dokumen = d.dokumen? 1:0)
    
            res.status(200).json({
                status: 200,
                message: null,
                data: null,
                list: list,
                validation: [],
                log: [],
            });
        }
    }

    @httpGet('/:id')
    async detail(@request() req: Request, @response() res: Response) {
        let jenisSPPD = await this._queryBus.execute(
            new GetJenisSPPDQuery(parseInt(req.params.id))
        );
        jenisSPPD.dokumen = jenisSPPD.dokumen? 1:0

        res.status(200).json({
            status: 200,
            message: null,
            data: jenisSPPD,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/create')
    async store(@request() req: Request, @response() res: Response) {
        // await jenisSPPDCreateSchema.validate(req.body, { abortEarly: false })

        const jenis_sppd = await this._commandBus.send(
            new CreateJenisSPPDCommand(
                req.body.nama,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil menambahkan jenis sppd",
            data: jenis_sppd,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/update')
    async update(@request() req: Request, @response() res: Response) {
        // await jenisSPPDUpdateSchema.validate(req.body, { abortEarly: false })
        const jenisSPPD = await this._commandBus.send(
            new UpdateJenisSPPDCommand(
                parseInt(req.body.id),
                req.body.nama,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil update data jenis sppd",
            data: jenisSPPD,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpGet('/delete/:id')
    async delete(@request() req: Request, @response() res: Response) {
        const dataJenisSPPD = await this._queryBus.execute(
            new GetJenisSPPDQuery(parseInt(req.params.id))
        );
        await this._commandBus.send(
            new DeleteJenisSPPDCommand(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: "berhasil hapus jenis sppd",
            data: dataJenisSPPD,
            list: null,
            validation: [],
            log: [],
        });
    }
}