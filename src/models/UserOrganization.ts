import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Organisation } from "./Organization";

@Entity()
export class UserOrganization {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.userOrganizations)
  user!: User;

  @ManyToOne(
    () => Organisation,
    (organization) => organization.userOrganizations
  )
  organization!: Organisation;
}
