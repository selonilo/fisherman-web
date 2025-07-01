import { EnumFishType } from "../../enum/enum.fish.type";

export interface LocationQueryModel {
    name?: string;
    fishTypeList?: EnumFishType[];
    address?: string;
    userId?: number;
    onlyFavorite?: boolean;
}
