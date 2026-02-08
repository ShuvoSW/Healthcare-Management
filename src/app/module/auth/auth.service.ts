// import { Role, User } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
// import { prisma } from "../../lib/prisma";

interface IRegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
    const {name, email, password} = payload;

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            // default values
            // needsPasswordChange: false,
            // role: Role.PATIENT
        }
    })

    if(!data.user) {
        throw new Error("Failed to register patient");
    }

    //TODO : create patient profile in transaction after sign up of patient in user model
    // const patient = await prisma.$transaction(async (tx) => {
    //     await tx.pa
    // })

    return data
}

export const AuthService = {
    registerPatient
}