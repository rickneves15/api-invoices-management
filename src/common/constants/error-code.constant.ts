export enum ErrorCodeEnum {
  ExtractDataError = 'EXTRACT_DATA_ERROR',
  InvoicesAlreadyExists = 'INVOICES_ALREADY_EXISTS',
  CustomerDoesNotExist = 'CUSTOMER_DOES_NOT_EXIST',

  ErrorCodeUnknown = 'ERROR_CODE_UNKNOWN',
}

export const ErrorCode = Object.freeze<Record<ErrorCodeEnum, [string, number]>>(
  {
    [ErrorCodeEnum.ExtractDataError]: ['Extract data error', 500],
    [ErrorCodeEnum.InvoicesAlreadyExists]: ['Invoices already exists', 409],
    [ErrorCodeEnum.CustomerDoesNotExist]: ['Customer does not exist', 404],
    [ErrorCodeEnum.ErrorCodeUnknown]: ['Something went wrong', 500],
  },
)
