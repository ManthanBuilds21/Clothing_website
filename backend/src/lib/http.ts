import type { NextFunction, Request, Response } from 'express'

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message)
  }
}

export interface SuccessResponse<T> {
  success: true
  data: T
}

export interface FailureResponse {
  success: false
  message: string
  issues?: unknown
  detail?: string
}

export function asyncHandler(
  handler: (request: Request, response: Response, next: NextFunction) => Promise<void>,
) {
  return (request: Request, response: Response, next: NextFunction) => {
    void handler(request, response, next).catch(next)
  }
}

export function sendSuccess<T>(response: Response, data: T, statusCode = 200) {
  return response.status(statusCode).json({
    success: true,
    data,
  } satisfies SuccessResponse<T>)
}
