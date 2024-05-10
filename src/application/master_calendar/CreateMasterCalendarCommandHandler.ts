import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { CreateMasterCalendarCommand } from './CreateMasterCalendarCommand';
import { getConnection } from 'typeorm';
import { MasterCalendar } from '../../infrastructure/orm/MasterCalendar';

@injectable()
export class CreateMasterCalendarCommandHandler implements ICommandHandler<CreateMasterCalendarCommand> {
  commandToHandle: string = CreateMasterCalendarCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: CreateMasterCalendarCommand) {
    const _db = await getConnection("default");
    let master_calendar  = new MasterCalendar();
    master_calendar.tanggal_mulai = command.tanggal_mulai
    master_calendar.tanggal_akhir = command.tanggal_akhir
    master_calendar.keterangan = command.keterangan

    await _db.getRepository(MasterCalendar).save(master_calendar);
    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es

    return master_calendar;
  }
}