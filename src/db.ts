
import {config as dotenvConfig} from "dotenv";
import "babel-polyfill";
import "reflect-metadata";
import {createConnection, Repository} from "typeorm";
import typeorm from "typeorm";
import {User} from "./models/user";
import {env} from "process";
import {join as joinPath} from "path";
import {defaults, settings} from "./lib";

dotenvConfig();

const configs: { [key: string] : typeorm.ConnectionOptions } = {
    sqlite: {
        type: "sqlite",
        database: joinPath(__dirname, env.DBNAME || defaults.DBNAME),
    },
    mysql: {
        type:     "mysql",
        host:     env.DBHOST || defaults.DBHOST,
        username: env.DBUSER || defaults.DBUSER,
        password: env.DBPASS || defaults.DBPASS,
    },
}


interface connect_args {
    type?: string,
    synchronize?: boolean,
    logging?:     boolean,
}
export function connect(args: connect_args = {}): Promise<typeorm.Connection> {
    let {type=defaults.DBTYPE, logging=false, synchronize=true} = args || {};
    let entities = [ User ];
    let config = configs[type];

    if (!config) {
        throw new Error(`invalid db type ${type}`);
    }

    config = { ...config, logging, synchronize, entities };
    console.log("config:", config);
    return createConnection(config);
}

export async function userRepository(conn?: typeorm.Connection): Promise<typeorm.Repository<User>> {
    if (!conn)
        conn = await connect();
    return conn.getRepository(User);
}
