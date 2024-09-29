import {ActiveEnum, LanguageCodeEnum} from '@utility/domain/enum';
import typia from 'typia';

export interface AttendantDto {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

export interface PriceDto {
    price: number;
    currency: string;
}

export interface DurationVersionsDto {
    breakInSeconds: number;
    durationInSeconds: number;
    prices: PriceDto[];
}

export interface AttachmentDto {
    object: 'AttachmentDto';
    title: string;
    mimeType: string;
    fileUri: string;
    active: ActiveEnum;
}

export interface LocationDto {
    object: 'LocationDto';
    types: 'ONLINE_CUSTOM'[];
    password: string;
    address: string;
}

export interface CreatePublicOrderServiceDto {
    object: 'CreatePublicOrderServiceDto';
    serviceSnapshot: {
        _id: string;
        durationVersions: DurationVersionsDto[];
    };
    orderAppointmentDetails: {
        object: 'CreatePublicOrderAppointmentDetailsDto';
        start: string;
        end: string;
        languageCodes: LanguageCodeEnum[];
        attachments: AttachmentDto[];
        attendees: AttendantDto[];
        specialists: {
            _id: string;
            wasSelectedAnybody: boolean;
        }[];
        locations: LocationDto[];
        timeZone: string;
        createdAt: string;
        updatedAt: string;
    };
    customerNote: string;
}

export interface OrderProductDto {
    object: 'OrderProductDto';
    _id: string;
    quantity: number;
    orderServiceId: string;
    productSnapshot: {
        object: 'ProductDto';
        _id: string;
        productCode: string;
        name: string;
        description: string;
        price: number;
        productType: 'paid';
        inventoryCount: number;
        isActive: ActiveEnum;
        tags: string[];
        images: {
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
        }[];
        discountRate: number;
        seasonalDependency: string;
        createdAt: string;
        updatedAt: string;
    };
    meta: {
        object: 'MetaDto';
        history: {
            object: 'HistoryEntryDto';
            issuerRole: string;
            issuerId: string;
            reason: string;
            value: string;
            createdAt: string;
        }[];
    };
}

export interface CreatePublicOrderDto {
    object: 'CreatePublicOrderDto';
    _id: string;
    products: OrderProductDto[];
    services: CreatePublicOrderServiceDto[];
}

export const isCreatePublicOrderDto = typia.createIs<CreatePublicOrderDto>();
export const createRandomCreatePublicOrderDto =
    typia.createRandom<CreatePublicOrderDto>();
export const validateCreatePublicOrderDto =
    typia.createValidate<CreatePublicOrderDto>();
