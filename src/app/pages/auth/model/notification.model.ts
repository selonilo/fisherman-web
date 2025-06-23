import { UserModel } from "./user.model";

export interface NotificationModel {
    icon?: string;
    notificationMessage?: string;
    notificationDate?: Date;
    userModel?: UserModel;
}
