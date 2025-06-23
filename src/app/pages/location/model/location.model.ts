import { UserModel } from "../../auth/model/user.model";
import { EnumFishType } from "../../enum/enum.fish.type";

export interface LocationModel {
    id?: number;
    createdDate?: Date;
    updatedDate?: Date;
    createdBy?: string;
    updatedBy?: string;
    name?: string;
    description?: string;
    fishTypeList?: EnumFishType[];
    coordinate?: string;
    address?: string;
    userId?: number;
    isPublic?: boolean;
    userModel?: UserModel;
    approveCount?: number;
    isApproved?: boolean;
    isFavorited?: boolean;
    favoriteCount?: number;
}
