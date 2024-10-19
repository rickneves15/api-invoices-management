import { Prisma } from '@prisma/client'

import { createServiceUnitTestApp } from '~/common/tests/helpers/create-service-unit'
import { prisma } from '~/common/tests/lib/prisma'
import { mockCustomerData } from '~/common/tests/mocks/data/customer'
import { generateMockInvoice } from '~/common/tests/mocks/data/invoice'
import { CustomersService } from '~/modules/customers/customers.service'
import { ExtractInvoiceFromPdfService } from '~/modules/extract-from-pdf/extract-invoice.service'
import { InvoicesService } from '~/modules/invoices/invoices.service'

import { MetricsService } from './metrics.service'

describe('MetricsService', () => {
  const proxy = createServiceUnitTestApp({
    Service: MetricsService,
    services: [CustomersService, ExtractInvoiceFromPdfService, InvoicesService],
  })
  const mockedDataList = [] as Prisma.InvoiceCreateManyInput[]
  let customer

  beforeAll(async () => {
    customer = await prisma.customer.create({
      data: mockCustomerData,
    })

    for (let i = 0; i < 5; i++) {
      mockedDataList.push(generateMockInvoice(i, customer.customerNumber))
    }

    await prisma.invoice.createMany({
      data: mockedDataList,
    })
  })

  it('should be defined', () => {
    expect(proxy).toBeDefined()
  })

  describe('get-energy-stats', () => {
    it('should return energy stats for a customer', async () => {
      const result = await proxy.service.getEnergyStats()

      expect(result[0]).toMatchObject({
        referenceMonth: expect.any(String),
        energyConsumption: expect.any(Number),
        energyCompensated: expect.any(Number),
      })
    })
  })

  describe('get-energy-values', () => {
    it('should return energy values for a customer', async () => {
      const result = await proxy.service.getEnergyValues()

      expect(result[0]).toMatchObject({
        referenceMonth: expect.any(String),
        consumedEnergyValue: expect.anything(),
        compensatedEnergyValue: expect.anything(),
      })
    })
  })

  describe('get-total-energy-compensated', () => {
    it('should return total energy compensation', async () => {
      const result = await proxy.service.getTotalEnergyCompensated()

      expect(result).toMatchObject({
        total: expect.any(Number),
      })
    })
  })

  describe('get-total-energy-consumption', () => {
    it('should return total energy compensation', async () => {
      const result = await proxy.service.getTotalEnergyConsumption()

      expect(result).toMatchObject({
        total: expect.any(Number),
      })
    })
  })
})
