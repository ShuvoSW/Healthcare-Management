import {isValid, parseISO} from "date-fns";

export const convertToDateTime = (dateString: string | undefined) => {
    if(!dateString) return undefined;

    // const date = parseISO(dateString, "yyyy-MM-dd", new Date());
    const date = parseISO(dateString);
    //    let date: Date;

    // try {

    //     date = parseISO(dateString);
    // } catch {
    //     date = new Date(dateString);
    // }
    
    if(!isValid(date)) return undefined;

    return date
}