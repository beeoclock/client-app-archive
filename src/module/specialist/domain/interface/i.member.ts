import {RIBaseEntity} from '@utility/domain/interface/i.base-entity';

export interface IMember extends RIBaseEntity {
  object: 'Member';
  firstName: string;
  secondName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type RIMember = Required<IMember>;
export type ListMember = RIMember[];
