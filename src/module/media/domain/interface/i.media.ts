import {IBaseEntity} from '@src/module/utility/domain/interface';
import {MediaTypeEnum} from '@utility/domain/enum/media.type.enum';

export interface IMedia extends IBaseEntity<'Media'> {
  mediaType?: MediaTypeEnum;
  url?: string;
  metadata?: {
    object: 'MediaMetadata';
    height: number;
    size: number;
    width: number;
  };
}

export type RIMedia = Required<IMedia>;
export type IListMedia = RIMedia[];
