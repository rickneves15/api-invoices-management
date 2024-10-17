export enum ErrorCodeEnum {
  ExtractDataError = 'EXTRACT_DATA_ERROR',
  InvoicesAlreadyExists = 'INVOICES_ALREADY_EXISTS',
}

export const ErrorCode = Object.freeze<Record<ErrorCodeEnum, [string, number]>>(
  {
    [ErrorCodeEnum.ExtractDataError]: ['Extract data error', 500],
    [ErrorCodeEnum.InvoicesAlreadyExists]: ['Invoices already exists', 409],
  },
)
