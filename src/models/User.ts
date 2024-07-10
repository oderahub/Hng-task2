import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsEmail, Length } from "class-validator";
import { UserOrganization } from "./UserOrganization";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId!: string;

  @Column({ type: "varchar" })
  @Length(1)
  firstName!: string;

  @Column({ type: "varchar" })
  @Length(1)
  lastName!: string;

  @Column({ type: "varchar", unique: true })
  @IsEmail()
  email!: string;

  @Column({ type: "varchar" })
  @Length(6)
  password!: string;

  @Column({ type: "varchar" })
  phone!: string;

  @OneToMany(() => UserOrganization, (userOrg) => userOrg.user)
  userOrganizations?: UserOrganization[];
}
