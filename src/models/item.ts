import {
    Entity, PrimaryGeneratedColumn,
    PrimaryColumn, Column, CreateDateColumn,
    ManyToOne, OneToOne, OneToMany,
} from "typeorm";
import {
    validate, Contains, IsInt, MinLength,
    IsEmail, IsFQDN, IsDate, Min, Max,
    IsNotEmpty,
} from "class-validator";
import {User} from "./user";

export type ItemType = "story" | "comment";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    deleted: boolean = false;

    @Column()
    dead: boolean = false;

    @Column({nullable: false})
    itemType: ItemType;

    @Column({nullable: false})
    username: string;

    @CreateDateColumn()
    dateCreated: string;

    @CreateDateColumn()
    dateUpdated: string;

    @Column("int")
    score: number = 0;

    @Column()
    url: string = "";

    @Column({nullable: false})
    @IsNotEmpty({message: "Title is required"})
    title: string = "";

    @Column("text")
    description: string = "";

    @Column("text")
    text: string = "";

    @ManyToOne(type => User, user => user.items)
    user: User;
}
