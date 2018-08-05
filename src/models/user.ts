import {Entity, PrimaryGeneratedColumn, PrimaryColumn, Column} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column("text")
    description: string;
}
