export interface ICreatePrescriptionPayload {
    appointmentId: string;
    followUpData: Date;
    instructions: string;
}

export interface IUpdatePrescriptionPayload {
    followUpDate?: Date;
    instructions?: string;
}

