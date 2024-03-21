import "reflect-metadata"
import { DataSource } from "typeorm"
import { injectable } from "inversify"
import { Absen } from "../orm/Absen";
import { Cuti } from "../orm/Cuti";

@injectable()
export class AppDataSource {
    public static initialize():DataSource{
        const con = new DataSource({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "",
            database: "unpak-absensi",
            entities: [Absen,Cuti],
            logging: false,
            synchronize: true,
        })
        con
            .initialize()
            .then(() => {
                // console.log("Data Source has been initialized!")
            })
            .catch((err) => {
                // console.error("Error during Data Source initialization:", err)
            })
        
        return con;
    }
}