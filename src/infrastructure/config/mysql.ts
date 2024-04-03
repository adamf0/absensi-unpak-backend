import "reflect-metadata"
import { Connection, DataSource, createConnection } from "typeorm"
import { injectable } from "inversify"
import { Absen } from "../orm/Absen";
import { Cuti } from "../orm/Cuti";
import { JenisCuti } from "../orm/JenisCuti";
import { Izin } from "../orm/Izin";
import { Dosen } from "../orm/Dosen";

@injectable()
export class AppDataSource {
    public static initialize():DataSource{
        const con = new DataSource({
            type: "mysql",
            host: process.env.db_host,
            port: 3306,
            username: process.env.db_username,
            password: process.env.db_password,
            database: process.env.db_database,
            entities: [Absen,Cuti,JenisCuti,Izin],
            logging: true,
            synchronize: true,
        })
        con
            .initialize()
            .then(() => {
                console.log("Data Source has been initialized!")
            })
            .catch((err) => {
                console.error("Error during Data Source initialization:", err)
            })
        
        return con;
    }
    public static async initialize2(){
        try {
            const con = await createConnection({ // Menggunakan createConnection untuk membuat koneksi
                type: 'mysql',
                host: process.env.db_host,
                port: 3306,
                username: process.env.db_username,
                password: process.env.db_password,
                database: process.env.db_database,
                entities: [Absen,Cuti,JenisCuti,Izin],
                logging: true,
                synchronize: false,
            });
            console.log('Data Source has been initialized!');
            return con;
        } catch (err) {
            console.error('Error during Data Source initialization:', err);
            throw err; // Anda mungkin ingin melempar kembali kesalahan ini agar dapat ditangani di tempat lain jika diperlukan
        }
    }
    public static async simak(){
        try {
            const connection1 = await createConnection({
                name: "simak",
                type: "mysql",
                host: "localhost",
                port: 3306,
                username: "root",
                password: "",
                database: "unpak_simak",
                entities: [Dosen],
                synchronize: false,
            });

            console.log('Data Source has been initialized!');
            return connection1;
        } catch (err) {
            console.error('Error during Data Source initialization:', err);
            throw err; // Anda mungkin ingin melempar kembali kesalahan ini agar dapat ditangani di tempat lain jika diperlukan
        }
    }
}