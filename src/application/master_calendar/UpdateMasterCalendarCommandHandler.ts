import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { getConnection } from 'typeorm';
import { MasterCalendar } from '../../infrastructure/orm/MasterCalendar';
import { UpdateMasterCalendarCommand } from './UpdateMasterCalendarCommand';

@injectable()
export class UpdateMasterCalendarCommandHandler implements ICommandHandler<UpdateMasterCalendarCommand> {
  commandToHandle: string = UpdateMasterCalendarCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: UpdateMasterCalendarCommand) {
    const _db = await getConnection("default");
    let MASTER_CALENDAR = await _db.getRepository(MasterCalendar).findOneByOrFail({
      id: command.id,
    })
    MASTER_CALENDAR.tanggal_mulai = command.tanggal_mulai
    MASTER_CALENDAR.tanggal_akhir = command.tanggal_akhir
    MASTER_CALENDAR.keterangan = command.keterangan

    await _db.getRepository(MasterCalendar).save(MASTER_CALENDAR);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return MASTER_CALENDAR;
  }
}