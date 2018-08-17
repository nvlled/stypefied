import {
    Entity, PrimaryGeneratedColumn,
    PrimaryColumn, Column, CreateDateColumn, OneToMany
} from "typeorm";
import {
    validate, Contains, IsInt, MinLength,
    IsEmail, IsFQDN, IsDate, Min, Max,
} from "class-validator";
import {Item} from "./item";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    @MinLength(3, {message: "username is too short"})
    username: string;

    @Column()
    @MinLength(6, {message: "password must at least be 6 characters long"})
    password: string;

    @CreateDateColumn()
    dateCreated: string;

    @CreateDateColumn()
    dateUpdated: string;

    @Column("int")
    karma: number = 0;

    @Column()
    about: string = "";

    @Column()
    email: string = "";

    @Column("text")
    description: string = "";

    @OneToMany(type => Item, item => item.user)
    items: Item[]

    getComments(): Item[] {
        return this.items.filter(item => item.itemType == "comment");
    }

    getSubmissions(): Item[] {
        return this.items.filter(item => item.itemType == "story");
    }
}
