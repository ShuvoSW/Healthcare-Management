import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpecialty = async (payload: Specialty): Promise<Specialty> => {
        // throw new Error("Testing Error handle in create specialty service");
    const specialty = await prisma.specialty.create({
        data: payload
    })

    return specialty;
}

const getAllSpecialty = async (): Promise<Specialty[]> => {
    const specialties = await prisma.specialty.findMany();
    return specialties;
}

const deleteSpecialty = async (id: string): Promise<Specialty> => {
    const specialty = await prisma.specialty.delete({
        where: {id}
    })  
    return specialty;
}

export const SpecialtyService = {
    createSpecialty,
    getAllSpecialty,
    deleteSpecialty
}