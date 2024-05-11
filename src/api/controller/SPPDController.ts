import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
// import { SPPDCreateSchema, SPPDUpdateSchema } from '../../domain/validation/SPPDSchema';
import { CreateSPPDCommand } from '../../application/sppd/CreateSPPDCommand';
import { DeleteSPPDCommand } from '../../application/sppd/DeleteSPPDCommand';
import { GetSPPDQuery } from '../../application/sppd/GetSPPDQuery';
import { UpdateSPPDCommand } from '../../application/sppd/UpdateSPPDCommand';
import { GetAllSPPDQuery } from '../../application/sppd/GetAllSPPDQuery';

@controller('/sppd')
export class SPPDController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/')
    async index(@request() req: Request, @response() res: Response) {
        let nidn, nip, search, page, pageSize, startIndex, endIndex
        nidn = req.query?.nidn == undefined || req.query?.nidn == "null" ? null : req.query.nidn
        nip = req.query?.nip == undefined || req.query?.nip == "null" ? null : req.query.nip
        search = req.query?.search == undefined || req.query?.search == "null" ? null : req.query.search
        page = parseInt(String(req.query?.page ?? "1"));
        pageSize = parseInt(String(req.query?.pageSize ?? "10"));
        startIndex = (page - 1) * pageSize;
        endIndex = page * pageSize;

        let [data, count] = await this._queryBus.execute(
            new GetAllSPPDQuery(
                pageSize,
                startIndex,
                ["undefined", "null"].includes(nidn) ? null : nidn,
                ["undefined", "null"].includes(nip) ? null : nip,
                ["undefined", "null"].includes(search) ? null : search,
            )
        );
        data.map(d => d.dokumen = d.dokumen ? 1 : 0)

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
        let SPPD = await this._queryBus.execute(
            new GetSPPDQuery(parseInt(req.params.id))
        );
        SPPD.dokumen = SPPD.dokumen ? 1 : 0

        res.status(200).json({
            status: 200,
            message: null,
            data: SPPD,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/create')
    async store(@request() req: Request, @response() res: Response) {
        // await SPPDCreateSchema.validate(req.body, { abortEarly: false })

        const sppd = await this._commandBus.send(
            new CreateSPPDCommand(
                req.body.nidn,
                req.body.nip,
                req.body.anggota, //array
                req.body.jenis_sppd,
                req.body.tujuan,
                req.body.tanggal_berangkat,
                req.body.tanggal_kembali,
                req.body.keterangan,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil menambahkan SPPD",
            data: sppd,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/update')
    async update(@request() req: Request, @response() res: Response) {
        // await SPPDUpdateSchema.validate(req.body, { abortEarly: false })
        const SPPD = await this._commandBus.send(
            new UpdateSPPDCommand(
                parseInt(req.body.id),
                req.body.nidn,
                req.body.nip,
                req.body.anggota, //array
                req.body.jenis_sppd,
                req.body.tujuan,
                req.body.tanggal_berangkat,
                req.body.tanggal_kembali,
                req.body.keterangan,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil update data SPPD",
            data: SPPD,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpGet('/delete/:id')
    async delete(@request() req: Request, @response() res: Response) {
        const dataSPPD = await this._queryBus.execute(
            new GetSPPDQuery(parseInt(req.params.id))
        );
        await this._commandBus.send(
            new DeleteSPPDCommand(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: "berhasil hapus SPPD",
            data: dataSPPD,
            list: null,
            validation: [],
            log: [],
        });
    }
}