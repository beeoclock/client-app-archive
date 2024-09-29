import {PublicServiceDto} from "@order/domain/dto/public-order-service.dto";

export interface ISpecialist {
    object?: 'Specialist';
    // member?: IMember;
    avatar?: {
        object: 'MediaDto';
        url: string;
        _id: string;
    };
    assignments?: {
        service: {
            full: boolean;
            include: {
                service: PublicServiceDto;
            }[];
        };
    };
    firstName?: string;
    lastName?: string;
    _id: string;
}
