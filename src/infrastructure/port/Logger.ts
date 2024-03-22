import { injectable } from "inversify";
// import fs from 'fs';
import { ILog } from "../abstractions/messaging/ILog";
var fs = require('fs');

@injectable()
export class Log implements ILog {
  async saveLog(error:any){
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const fileName = `logError#Y${year}M${month}D${day}.json`;
   
    let errorData = [];
    if (fs.existsSync(fileName)) {
        errorData = JSON.parse(fs.readFileSync(fileName));
    }
    errorData.push({
        timestamp: Date.now(),
        error: error.toString()
    });
    fs.writeFileSync(fileName, JSON.stringify(errorData, null, 2));
  }
}