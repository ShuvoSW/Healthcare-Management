/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";

export const loginAction = async (payload : ILoginPayload, redirectPath ?: string ) : Promise<ILoginResponse | ApiErrorResponse | { success: true; redirectTo: string; message?: string }> =>{
    const parsedPayload = loginZodSchema.safeParse(payload);

    if(!parsedPayload.success){
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }

    try {
        const response = await httpClient.post<ILoginResponse>("/auth/login", parsedPayload.data);

        const { accessToken, refreshToken, token, user} = response.data;
        const {role, emailVerified, needPasswordChange, email} = user;

        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

        if (emailVerified === false) {
            return {
                success: true,
                redirectTo: `/verify-email?email=${encodeURIComponent(payload.email)}`,
                message: "Email verification required",
            };
        }

        if (needPasswordChange) {
            return {
                success: true,
                redirectTo: `/reset-password?email=${encodeURIComponent(email)}`,
                message: "Password change required",
            };
        }

        const targetPath = redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
            ? redirectPath
            : getDefaultDashboardRoute(role as UserRole);

        return {
            success: true,
            redirectTo: targetPath,
            message: "Login successful",
        };
    } catch (error : any) {
        console.log(error, "error");

        if (error && error.response && error.response.data.message === "Email not verified") {
            return {
                success: true,
                redirectTo: `/verify-email?email=${encodeURIComponent(payload.email)}`,
                message: "Email verification required",
            };
        }

        return {
            success: false,
            message: `Login failed: ${error?.message || "Something went wrong"}`,
        }
    }
}