"use server";

import { queryRagService } from "@/services/rag.services";
import { error } from "console";

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
                    answer = `I found ${doctors.length} doctors who may help you:\n\n` + doctors.map((d: any, i:number)=> {
                        let test = `if(d.name)`
                    })
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}