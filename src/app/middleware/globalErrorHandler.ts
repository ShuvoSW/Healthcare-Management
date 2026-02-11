/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { env } from "node:process";
import { envVars } from "../config/env";
import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";


/* eslint-disable @typescript-eslint/no-explicit-any */
export const globalErrorHandler = (err:any, req: Request, res: Response, next: NextFunction) => {
  if (envVars.NODE_ENV === 'development') {
    console.error("Error from Global Error Handler", err);
  }

  let errorSources: TErrorSources[] = []
  let statusCode : number = status.INTERNAL_SERVER_ERROR;
  let message : string = 'Internal Server Error';

  // Zod error pattern
  /*
  error.issues; 
      [
      {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' ],
        message: 'Invalid input: expected string'
      },
      {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
      }
    ]
      */

  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message
    errorSources = [...simplifiedError.errorSources]

  //   err.issues.forEach(issue => {
  //   errorSources.push({
  //     path: issue.path.join(" => "), 
  //     message: issue.message
  //   })
  // })
  }

  

  const errorResponse: TErrorResponse ={
    success: false,
    message: message,
    errorSources,
    error: envVars.NODE_ENV === 'development' ? err: undefined,
    
  }
  // res.status(statusCode).json({
  //   success: false,
  //   message: message,
  //   errorSources,
  //   error: envVars.NODE_ENV === 'development' ? err: undefined,
    
  // })
  res.status(statusCode).json(errorResponse)
}