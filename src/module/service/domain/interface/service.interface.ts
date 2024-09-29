import {ActiveEnum} from '@utility/domain/enum/active.enum';
import {LanguageCodeEnum} from '@utility/domain/enum';
import {CurrencyCodeEnum} from '@utility/domain/enum/currency-code.enum';
import {ISpecialist} from '@module/specialist/domain';
import {ISchedule} from '@utility/domain/interface/i.schedule';
import {IBaseEntity} from '@utility/domain/interface';
import {IDurationConfiguration} from '@service/domain/interface/i.duration-configuration';
import {RIMedia} from '@module/media/domain/interface/i.media';

export interface IConfiguration {
  duration?: IDurationConfiguration;
}

export interface IPrepaymentPolicy {
  isRequired?: boolean;
  isPercentage?: boolean;
  value?: string;
  minimalCancelTime?: string;
}

export interface ILanguageVersion {
  title?: string;
  description?: string;
  language: LanguageCodeEnum;
  active?: ActiveEnum;
}

export type RILanguageVersion = Required<ILanguageVersion>;

export interface IPrice {
  price: number;
  currency: CurrencyCodeEnum;
  preferredLanguages?: LanguageCodeEnum[];
}

export interface IDurationVersion {
  breakInSeconds: number;
  durationInSeconds: number;
  prices: IPrice[];
}

export interface IPresentation extends IBaseEntity<'Service.Presentation'> {
  banners: RIMedia[];
}

export interface IService extends IBaseEntity<'Service'> {
  active: ActiveEnum;
  configuration: IConfiguration;
  prepaymentPolicy: IPrepaymentPolicy;
  schedules: ISchedule[];
  languageVersions: ILanguageVersion[];
  durationVersions: IDurationVersion[];
  specialists: ISpecialist[];
  presentation: IPresentation;
}
