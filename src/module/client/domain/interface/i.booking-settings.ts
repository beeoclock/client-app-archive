import {ApprovalTimeEnum} from '@utility/domain/enum/approval-time.enum';
import {LatestBookingEnum} from '@utility/domain/enum/latest-booking.enum';
import {EarliestBookingEnum} from '@utility/domain/enum/earliest-booking.enum';
import {ISlotSettings} from '@client/domain/interface/i.slot-settings';

export interface IBookingSettings {
  object: 'BookingSettings';
  approvalTime: ApprovalTimeEnum; // in seconds (Time after which the requested event will be canceled, if not approved)
  latestBooking: LatestBookingEnum; // in seconds (Minimum notice time)
  earliestBooking: EarliestBookingEnum; // in seconds (When an event can be booked)
  slotSettings: ISlotSettings;
  autoBookEvent?: boolean;
  mandatoryAttendeeProperties?: string[];
}
