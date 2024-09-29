import {ActiveEnum, CurrencyCodeEnum, LanguageCodeEnum,} from '@utility/domain/enum';
import {ISocialNetworkLink} from '@client/domain/interface/i.social-network-link';
import {IBaseEntity, RISchedule} from '@utility/domain/interface';
import {FacilityEnum} from '@utility/domain/enum/facility.enum';
import {IContact} from '@client/domain/interface/i.contact';
import {RIAddress} from '@client/domain/interface/i.address';
import {IBookingSettings} from '@client/domain/interface/i.booking-settings';
import {BusinessCategoryEnum} from '@utility/domain/enum/business-category.enum';
import {RIMedia} from '@module/media/domain/interface/i.media';

export interface IBusinessSettings {
  timeZoneOffsetInMinutes?: number;
  timeZone?: string;
  currencies?: CurrencyCodeEnum[];
  availableLanguages: LanguageCodeEnum[];
  emailLanguage: LanguageCodeEnum;
  createdAt?: string;
  updatedAt?: string;
}

export interface IClient extends IBaseEntity<'Client'> {
  published: ActiveEnum;
  name: string;
  username?: string;
  logo: RIMedia | null | undefined;
  feature: string;
  businessCategory: BusinessCategoryEnum;
  socialNetworkLinks: ISocialNetworkLink[];

  banners: RIMedia[];
  bookingSettings: IBookingSettings;
  businessSettings: IBusinessSettings;
  addresses: RIAddress[];
  schedules: RISchedule[];
  contacts: IContact[];
  gallery: RIMedia[];
  description: string;
  facilities: FacilityEnum[];
}
