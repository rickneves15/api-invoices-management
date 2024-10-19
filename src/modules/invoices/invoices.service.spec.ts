import { Prisma } from '@prisma/client'

import { ErrorCodeEnum } from '~/common/constants/error-code.constant'
import { BizException } from '~/common/exceptions/biz.exception'
import { createServiceUnitTestApp } from '~/common/tests/helpers/create-service-unit'
import {
  deleteInvoiceTestUrl,
  getInvoiceTestUrl,
} from '~/common/tests/lib/file'
import { prisma } from '~/common/tests/lib/prisma'
import { mockCustomerData } from '~/common/tests/mocks/data/customer'
import { generateMockInvoice } from '~/common/tests/mocks/data/invoice'
import { CustomersService } from '~/modules/customers/customers.service'
import { ExtractInvoiceFromPdfService } from '~/modules/extract-from-pdf/extract-invoice.service'

import { UploadInvoiceDto } from './dtos/upload-invoice.dto'
import { InvoicesService } from './invoices.service'

describe('InvoicesService', () => {
  const proxy = createServiceUnitTestApp({
    Service: InvoicesService,
    services: [CustomersService, ExtractInvoiceFromPdfService],
  })
  let invoiceUrl: string

  afterEach(async () => {
    await prisma.customer.deleteMany()
    await prisma.invoice.deleteMany()
  })

  afterAll(async () => {
    await deleteInvoiceTestUrl(invoiceUrl)
  })

  describe('process-invoice', () => {
    it('should process an uploaded invoice', async () => {
      invoiceUrl = await getInvoiceTestUrl()
      const invoicesFiles = {
        invoicesFiles: [{ location: invoiceUrl }],
      } as UploadInvoiceDto

      const result = await proxy.service.processInvoice(invoicesFiles)

      expect(result).toBeDefined()
      expect(result.length).toEqual(1)
      expect(result[0]).toMatchObject({
        id: expect.any(String),
        installationNumber: expect.any(BigInt),
        referenceMonth: expect.any(String),
        totalAmount: expect.anything(),
        dueDate: expect.any(Date),
        energyQuantity: expect.anything(),
        energyAmount: expect.anything(),
        exemptEnergyQuantity: expect.anything(),
        exemptEnergyAmount: expect.anything(),
        compensatedEnergyQuantity: expect.anything(),
        compensatedEnergyAmount: expect.anything(),
        municipalPublicLightingContribution: expect.anything(),
        invoiceUrl,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        customerId: expect.any(BigInt),
      })
    })

    it('should throw an error if the invoice already exists', async () => {
      try {
        invoiceUrl = await getInvoiceTestUrl()
        const invoicesFiles = {
          invoicesFiles: [{ location: invoiceUrl }],
        } as UploadInvoiceDto

        await proxy.service.processInvoice(invoicesFiles)
      } catch (error) {
        expect(error).toEqual(
          new BizException(ErrorCodeEnum.InvoicesAlreadyExists),
        )
      }
    })
  })

  describe('get-invoices', () => {
    it('should retrieve a list of invoices', async () => {
      const mockedDataList = [] as Prisma.InvoiceCreateManyInput[]

      const customer = await prisma.customer.create({
        data: mockCustomerData,
      })

      for (let i = 0; i < 3; i++) {
        mockedDataList.push(generateMockInvoice(i, customer.customerNumber))
      }

      await prisma.invoice.createMany({
        data: mockedDataList,
      })

      const result = await proxy.service.getInvoices({
        page: 1,
        perPage: 10,
      })

      expect(result.data[0]).toMatchObject({
        id: expect.any(String),
        installationNumber: expect.any(BigInt),
        referenceMonth: expect.any(String),
        totalAmount: expect.anything(),
        dueDate: expect.any(Date),
        energyQuantity: expect.anything(),
        energyAmount: expect.anything(),
        exemptEnergyQuantity: expect.anything(),
        exemptEnergyAmount: expect.anything(),
        compensatedEnergyQuantity: expect.anything(),
        compensatedEnergyAmount: expect.anything(),
        municipalPublicLightingContribution: expect.anything(),
        invoiceUrl,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        customerId: expect.any(BigInt),
      })
      expect(result.data[1]).toMatchObject({
        id: expect.any(String),
        installationNumber: expect.any(BigInt),
        referenceMonth: expect.any(String),
        totalAmount: expect.anything(),
        dueDate: expect.any(Date),
        energyQuantity: expect.anything(),
        energyAmount: expect.anything(),
        exemptEnergyQuantity: expect.anything(),
        exemptEnergyAmount: expect.anything(),
        compensatedEnergyQuantity: expect.anything(),
        compensatedEnergyAmount: expect.anything(),
        municipalPublicLightingContribution: expect.anything(),
        invoiceUrl,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        customerId: expect.any(BigInt),
      })
      expect(result.data[2]).toMatchObject({
        id: expect.any(String),
        installationNumber: expect.any(BigInt),
        referenceMonth: expect.any(String),
        totalAmount: expect.anything(),
        dueDate: expect.any(Date),
        energyQuantity: expect.anything(),
        energyAmount: expect.anything(),
        exemptEnergyQuantity: expect.anything(),
        exemptEnergyAmount: expect.anything(),
        compensatedEnergyQuantity: expect.anything(),
        compensatedEnergyAmount: expect.anything(),
        municipalPublicLightingContribution: expect.anything(),
        invoiceUrl,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        customerId: expect.any(BigInt),
      })

      expect(result.meta).toMatchObject({
        total: expect.any(Number),
        lastPage: expect.any(Number),
        currentPage: expect.any(Number),
        perPage: expect.any(Number),
      })
      expect(result.meta.prev).toBeOneOf([null, expect.any(Number)])
      expect(result.meta.next).toBeOneOf([null, expect.any(Number)])
    })

    it('should filter invoices by customer number', async () => {
      const mockedDataList = [] as Prisma.InvoiceCreateManyInput[]

      const customer = await prisma.customer.create({
        data: mockCustomerData,
      })

      for (let i = 0; i < 3; i++) {
        mockedDataList.push(generateMockInvoice(i, customer.customerNumber))
      }

      await prisma.invoice.createMany({
        data: mockedDataList,
      })

      const result = await proxy.service.getInvoices({
        page: 1,
        perPage: 10,
        customerNumber: customer.customerNumber,
      })

      expect(result.data[0]).toMatchObject({
        id: expect.any(String),
        installationNumber: expect.any(BigInt),
        referenceMonth: expect.any(String),
        totalAmount: expect.anything(),
        dueDate: expect.any(Date),
        energyQuantity: expect.anything(),
        energyAmount: expect.anything(),
        exemptEnergyQuantity: expect.anything(),
        exemptEnergyAmount: expect.anything(),
        compensatedEnergyQuantity: expect.anything(),
        compensatedEnergyAmount: expect.anything(),
        municipalPublicLightingContribution: expect.anything(),
        invoiceUrl,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        customerId: expect.any(BigInt),
      })
      expect(result.data[1]).toMatchObject({
        id: expect.any(String),
        installationNumber: expect.any(BigInt),
        referenceMonth: expect.any(String),
        totalAmount: expect.anything(),
        dueDate: expect.any(Date),
        energyQuantity: expect.anything(),
        energyAmount: expect.anything(),
        exemptEnergyQuantity: expect.anything(),
        exemptEnergyAmount: expect.anything(),
        compensatedEnergyQuantity: expect.anything(),
        compensatedEnergyAmount: expect.anything(),
        municipalPublicLightingContribution: expect.anything(),
        invoiceUrl,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        customerId: expect.any(BigInt),
      })
      expect(result.data[2]).toMatchObject({
        id: expect.any(String),
        installationNumber: expect.any(BigInt),
        referenceMonth: expect.any(String),
        totalAmount: expect.anything(),
        dueDate: expect.any(Date),
        energyQuantity: expect.anything(),
        energyAmount: expect.anything(),
        exemptEnergyQuantity: expect.anything(),
        exemptEnergyAmount: expect.anything(),
        compensatedEnergyQuantity: expect.anything(),
        compensatedEnergyAmount: expect.anything(),
        municipalPublicLightingContribution: expect.anything(),
        invoiceUrl,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        customerId: expect.any(BigInt),
      })

      expect(result.meta).toMatchObject({
        total: expect.any(Number),
        lastPage: expect.any(Number),
        currentPage: expect.any(Number),
        perPage: expect.any(Number),
      })
      expect(result.meta.prev).toBeOneOf([null, expect.any(Number)])
      expect(result.meta.next).toBeOneOf([null, expect.any(Number)])
    })

    it('should filter invoices by reference month', async () => {
      const mockedDataList = [] as Prisma.InvoiceCreateManyInput[]

      const customer = await prisma.customer.create({
        data: mockCustomerData,
      })

      for (let i = 0; i < 3; i++) {
        mockedDataList.push(generateMockInvoice(i, customer.customerNumber))
      }

      await prisma.invoice.createMany({
        data: mockedDataList,
      })

      const result = await proxy.service.getInvoices({
        page: 1,
        perPage: 10,
        referenceMonth: 'JAN/2024',
      })

      expect(result.data[0]).toMatchObject({
        id: expect.any(String),
        installationNumber: expect.any(BigInt),
        referenceMonth: expect.any(String),
        totalAmount: expect.anything(),
        dueDate: expect.any(Date),
        energyQuantity: expect.anything(),
        energyAmount: expect.anything(),
        exemptEnergyQuantity: expect.anything(),
        exemptEnergyAmount: expect.anything(),
        compensatedEnergyQuantity: expect.anything(),
        compensatedEnergyAmount: expect.anything(),
        municipalPublicLightingContribution: expect.anything(),
        invoiceUrl,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        customerId: expect.any(BigInt),
      })

      expect(result.meta).toMatchObject({
        total: expect.any(Number),
        lastPage: expect.any(Number),
        currentPage: expect.any(Number),
        perPage: expect.any(Number),
      })
      expect(result.meta.prev).toBeOneOf([null, expect.any(Number)])
      expect(result.meta.next).toBeOneOf([null, expect.any(Number)])
    })
  })

  describe('get-invoice', () => {
    it('should retrieve a single invoice', async () => {
      const customer = await prisma.customer.create({
        data: mockCustomerData,
      })
      const invoice = generateMockInvoice(0, customer.customerNumber)

      await prisma.invoice.create({
        data: invoice,
      })

      const result = await proxy.service.getInvoice({
        customerId: invoice.customerId,
        referenceMonth: invoice.referenceMonth,
      })

      expect(result).toMatchObject({
        id: expect.any(String),
        installationNumber: expect.any(BigInt),
        referenceMonth: expect.any(String),
        totalAmount: expect.anything(),
        dueDate: expect.any(Date),
        energyQuantity: expect.anything(),
        energyAmount: expect.anything(),
        exemptEnergyQuantity: expect.anything(),
        exemptEnergyAmount: expect.anything(),
        compensatedEnergyQuantity: expect.anything(),
        compensatedEnergyAmount: expect.anything(),
        municipalPublicLightingContribution: expect.anything(),
        invoiceUrl,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        customerId: expect.any(BigInt),
      })
    })
  })

  describe('create-invoice', () => {
    it('should create a new invoice', async () => {
      const customer = await prisma.customer.create({
        data: mockCustomerData,
      })

      const invoice = generateMockInvoice(
        0,
        customer.customerNumber,
      ) as Prisma.InvoiceCreateManyInput

      const result = await proxy.service.createInvoice(invoice)

      expect(result).toMatchObject({
        id: expect.any(String),
        installationNumber: expect.any(BigInt),
        referenceMonth: expect.any(String),
        totalAmount: expect.anything(),
        dueDate: expect.any(Date),
        energyQuantity: expect.anything(),
        energyAmount: expect.anything(),
        exemptEnergyQuantity: expect.anything(),
        exemptEnergyAmount: expect.anything(),
        compensatedEnergyQuantity: expect.anything(),
        compensatedEnergyAmount: expect.anything(),
        municipalPublicLightingContribution: expect.anything(),
        invoiceUrl,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        customerId: expect.any(BigInt),
      })
    })
  })

  describe('get-total-invoices', () => {
    it('should retrieve the total number of invoices', async () => {
      const customer = await prisma.customer.create({
        data: mockCustomerData,
      })
      const invoice = generateMockInvoice(0, customer.customerNumber)

      await prisma.invoice.create({
        data: invoice,
      })
      const result = await proxy.service.getTotalInvoices()

      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('difference')
      expect(result.total).toEqual(expect.any(Number))
      expect(result.difference).toEqual(expect.any(Number))
    })
  })
})
