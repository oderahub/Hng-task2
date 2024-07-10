import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserOrganization } from "./UserOrganization";

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn("uuid")
  orgId!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @OneToMany(() => UserOrganization, (userOrg) => userOrg.organization)
  userOrganizations?: UserOrganization[];
}
