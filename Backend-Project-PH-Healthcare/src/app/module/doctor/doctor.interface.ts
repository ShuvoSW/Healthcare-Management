import { Gender } from "../../../generated/prisma/enums";

export interface IUpdateDoctorSpecialtyPayload {
    specialtyId: string;
    shouldDelete?: boolean;
}
export interface IUpdateDoctorPayload {
    doctor?: {
        name?: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        experience?: number
        registrationNumber?: string;
        gender?: Gender;
        appointmentFee?: number;
        qualifications?: string;
        currentWorkingPlace?: string;
        designation?: string;
    },
    specialties?: IUpdateDoctorSpecialtyPayload[];
}