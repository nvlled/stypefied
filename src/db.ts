
import {config as dotenvConfig} from "dotenv";
import {createConnection, Repository} from "typeorm";
import typeorm from "typeorm";
import {User} from "./models/user";
import {env} from "process";
import {join as joinPath} from "path";
import defaults from "./lib/defaults";
import settings from "./lib/settings";

dotenvConfig();

const configs: { [key: string] : typeorm.ConnectionOptions } = {
    sqlite: {
        type: "sqlite",
        database: joinPath(__dirname, env.DB_NAME || defaults.DB_NAME),
    },
    mysql: {
        type:     "mysql",
        host:     env.DB_HOST || defaults.DB_HOST,
        username: env.DB_USER || defaults.DB_USER,
        password: env.DB_PASS || defaults.DB_PASS,
    },
}

interface connect_args {
    type?: string,
    synchronize?: boolean,
    logging?:     boolean,
}
function connect(args: connect_args = {}): Promise<typeorm.Connection> {
    let {type=defaults.DB_TYPE, logging=false, synchronize=true} = args || {};
    let entities = [ joinPath(__dirname, "models", "*.js") ];
    let config = configs[type];

    if (!config) {
        throw new Error(`invalid db type ${type}`);
    }

    config = { ...config, logging, synchronize, entities };
    console.log("config:", config);
    return createConnection(config);
}

export async function getRepository<Entity>(model: typeorm.ObjectType<Entity> | typeorm.EntitySchema<Entity> | string): Promise<typeorm.Repository<Entity>> {
    let conn = await connection;
    return conn.getRepository(model);
}

export async function getTreeRepository<Entity>(model: typeorm.ObjectType<Entity> | typeorm.EntitySchema<Entity> | string): Promise<typeorm.TreeRepository<Entity>> {
    let conn = await connection;
    return conn.getTreeRepository(model);
}


export async function userRepository(conn?: typeorm.Connection): Promise<typeorm.Repository<User>> {
    if (!conn)
        conn = await connection;
    return conn.getRepository(User);
}

export const connection = connect();

