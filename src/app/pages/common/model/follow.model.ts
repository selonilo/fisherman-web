import {BaseModel} from "./base.model";
import {EnumContentType} from "../../enum/enum.content.type";

export interface FollowModel extends BaseModel {
    userId: number;
    contentId: number;
    contentType: EnumContentType;
}
