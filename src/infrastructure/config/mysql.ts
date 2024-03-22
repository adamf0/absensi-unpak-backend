import "reflect-metadata"
import { Connection, DataSource, createConnection } from "typeorm"
import { injectable } from "inversify"
import { Absen } from "../orm/Absen";
import { Cuti } from "../orm/Cuti";

@injectable()
export class AppDataSource {
    public static initialize():DataSource{
        const con = new DataSource({
            type: "mysql",
            host: process.env.db_host,
            port: 3306,
            username: process.env.username,
            password: process.env.password,
            database: process.env.database,
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
    public static async initialize2(){
        try {
            const con = createConnection({ // Menggunakan createConnection untuk membuat koneksi
                type: 'mysql',
                host: process.env.db_host,
                port: 3306,
                username: process.env.username,
                password: process.env.password,
                database: process.env.database,
                entities: [Absen, Cuti],
                logging: false,
                synchronize: false,
            });
            console.log('Data Source has been initialized!');
            return con;
        } catch (err) {
            console.error('Error during Data Source initialization:', err);
            throw err; // Anda mungkin ingin melempar kembali kesalahan ini agar dapat ditangani di tempat lain jika diperlukan
        }
    }
}