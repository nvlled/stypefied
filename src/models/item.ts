import {
    Entity, PrimaryGeneratedColumn,
    PrimaryColumn, Column, CreateDateColumn,
    ManyToOne, OneToOne, OneToMany,
    Tree, TreeParent, TreeChildren, TreeLevelColumn,
} from "typeorm";
import {
    validate, Contains, IsInt, MinLength,
    IsEmail, IsFQDN, IsDate, Min, Max,
    IsNotEmpty, ValidateIf
} from "class-validator";
import {User} from "./user";

export type ItemType = "story" | "comment";


@Entity()
@Tree("closure-table")
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

    @ValidateIf(o => o.itemType == "story")
    @Column({nullable: false})
    @IsNotEmpty({message: "Title is required"})
    title: string = "";

    @Column("text")
    description: string = "";

    @ValidateIf(o => o.itemType == "comment")
    @Column("text")
    @IsNotEmpty({message: "Content is required"})
    text: string = "";

    @ManyToOne(type => User, user => user.items)
    user: User;

    @TreeParent()
    parent: Item

    @TreeChildren()
    replies: Item[]

    root(): Item | null {
        let item = this.parent;
        if (!item)
            return null;

        while(true) {
            if (!item.parent)
                return item;
            item = item.parent;
        }
        return null;
    }
}
