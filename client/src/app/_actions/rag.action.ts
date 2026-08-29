/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ingestDoctorServices, queryRagService } from "@/services/rag.services";



export const queryRagAction = async(query: string) => {
    try {
        const response = await queryRagService({query});

        if(!response?.data?.answer){
            return {
                success: false,
                error: "No answer received from AI. Please try again"
            }
        }

        let answer = response?.data?.answer;

        if (typeof answer === "object" && answer !== null) {
            if ('doctors' in answer && Array.isArray(answer.doctors)) {
                const doctors = answer.doctors.slice(0, 5);

                if(doctors.length>0){
                    answer = `I found ${doctors.length} doctors who may help you:\n\n` + doctors.map((d: any, i: number)=> {
                        let text = `` 
                        if(d.name) text+=`${i+1}. **${d.name}\n**`
                        if(d.specialty) text+=`Specialization: ${d.specialty}\n`
                        if(d.reason) text+=`why: ${d.reason}\n`
                        return text + "\n"

                    })
                } else {
                    answer = "I could not find any doctors who may help you. Please try again with a different query."  
                }
            }else{
                answer = JSON.stringify(answer, null, 2);
            }
        }

        const sources = 100 - Number(response?.data?.sources[0]?.similarity)*100;

        return {
            success: true,
            answer: answer as string,
            // sources: `${sources}%matched`,
            // sources: `${(sources).toFixed(2)}%matched`,
            sources: response?.data?.sources ?? [],
        }
    } catch (error) {
        console.log(error);
        return {
            success: true,
            answer: "Failed to reach AI service. Please  check your connection try again.",
        }
    }
}

export const ingestDoctorsAction = async() => {
    try {
        const response = await ingestDoctorServices();

        return {
            success: true,
            indexedCount: response?.data?.indexedCount,
            message:
            response?.data?.message ?? response.message ?? "Doctor data synced successfully"
        }
    } catch (error) {
        console.log(error);
        const message = "Failed to sync doctor data. Please try again.";
        return {
            success: false,
            message,
            error: message,
        }
    }
}

export const getUserRoleAction = async() => {
    try {
        const {getUserInfo} = await import("@/services/auth.services");
        const userInfo = await getUserInfo();
        return userInfo?.role ?? null;
    } catch (error) {
        console.log(error);
    }
}