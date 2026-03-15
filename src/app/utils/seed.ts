import { Role } from "../../generated/prisma/enums"
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma"
import { envVars } from "../config/env";


export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExists = await prisma.user.findFirst({
            where: {
                role: Role.SUPER_ADMIN
            }
        })

        if(isSuperAdminExists) {
            console.log("Super admin already exists. Skipping seeding super admin.");
            return;
        }

        const superAdminUser = await auth.api.signUpEmail({
            body:{
                email: envVars.SUPER_ADMIN_EMAIL,
                password: envVars.SUPER_ADMIN_PASSWORD,
                name: "Super Admin",
                needPasswordChange: false,
                rememberMe: false, 
            }
        })

        await prisma.$transaction( async (tx) => {
            
            await tx.user.update({
                where: {
                    id: superAdminUser.user.id
                },
                data: {
                    emailVerified: true
                }
            })
            await tx.admin.create({
                data: {
                    userId: superAdminUser.user.id,
                    name: "Super Admin",
                    email: envVars.SUPER_ADMIN_EMAIL,
                }
            })

            })
            const superAdmin = await prisma.admin.findFirst({
                where: {
                    email: envVars.SUPER_ADMIN_EMAIL,
                },
                include: {
                    user: true,
                }
            })

            console.log("Super admin created ", superAdmin);
    } catch (error) {
        console.error("Error seeding super admin: ", error);
        await prisma.user.delete({
            where: {
                email: envVars.SUPER_ADMIN_EMAIL
            }
        })
    }
}