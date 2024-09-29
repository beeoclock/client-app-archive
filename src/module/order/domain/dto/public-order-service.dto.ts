import {ActiveEnum, CurrencyCodeEnum, LanguageCodeEnum,} from '@utility/domain/enum';

export interface PublicServiceDto {
    object: 'PublicServiceDto';
    _id: string;
    active: ActiveEnum;
    configuration: {
        object: 'ServiceConfigurationDto';
        duration: {
            object: 'DurationConfigurationDto';
            durationVersionType: 'RANGE';
        };
    };
    presentation: {
        object: 'PresentationDto';
        banners: string[];
        color: string;
    };
    languageVersions: {
        object: 'LanguageVersionDto';
        title: string;
        description: string;
        language: LanguageCodeEnum;
        active: ActiveEnum;
    }[];
    durationVersions: {
        object: 'DurationVersionDto';
        breakInSeconds: number;
        durationInSeconds: number;
        prices: {
            object: 'PriceDto';
            price: number;
            currency: CurrencyCodeEnum;
            preferredLanguages: LanguageCodeEnum;
        }[];
    }[];
    schedules: {
        workDays: number[];
        startInSeconds: number;
        endInSeconds: number;
    }[];
    createdAt: string;
    updatedAt: string;
    order: number;
}

export interface LocationDto {
    object: 'LocationDto';
    types: 'ONLINE_CUSTOM'[];
    password: string;
    address: string;
}

export interface PublicOrderAppointmentDetailsDto {
    object: 'PublicOrderAppointmentDetailsDto';
    start: string;
    end: string;
    languageCodes: LanguageCodeEnum[];
    attachments: {
        object: 'AttachmentDto';
        title: string;
        mimeType: string;
        fileUri: string;
        active: ActiveEnum;
    }[];
    attendees: {
        _id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
    }[];
    specialists: {
        _id: string;
        firstName: string;
        lastName: string;
        avatar: {
            object: 'MediaDto';
            _id: string;
            url: string;
            mediaType: string;
            metadata: {
                object: 'MediaMetadataDto';
                original: boolean;
                format: string;
                height: number;
                width: number;
                size: number;
            };
            createdAt: string;
            updatedAt: string;
        };
        assignments: {
            object: 'AssignmentsDto';
            service: {
                object: 'AssignmentServiceDto';
                full: boolean;
                include: {
                    object: 'AssignedServiceDto';
                    serviceId: string;
                }[];
            };
        };
    }[];
    locations: LocationDto[];
    timeZone: string;
    createdAt: string;
    updatedAt: string;
}

export enum OrderServiceStatusEnum {
    requested = 'requested',
    accepted = 'accepted',
    inProgress = 'inProgress',
    done = 'done',
    rejected = 'rejected',
    cancelled = 'cancelled'
}


export interface PublicOrderServiceDto {
    object: 'PublicOrderServiceDto';
    _id: string;
    serviceSnapshot: PublicServiceDto;
    orderAppointmentDetails: PublicOrderAppointmentDetailsDto;
    customerNote: string;
    status: OrderServiceStatusEnum;
}
