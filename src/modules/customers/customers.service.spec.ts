import { Prisma } from '@prisma/client'

import { createServiceUnitTestApp } from '~/common/tests/helpers/create-service-unit'
import { prisma } from '~/common/tests/lib/prisma'
import {
  generateMockCustomer,
  mockCustomerData,
} from '~/common/tests/mocks/data/customer'

import { CustomersService } from './customers.service'

describe('CustomersService', () => {
  const proxy = createServiceUnitTestApp({
    Service: CustomersService,
  })

  afterEach(async () => {
    await prisma.customer.deleteMany()
  })

  describe('create-customer', () => {
    it('should create a new customer', async () => {
      const result = await proxy.service.createCustomer(mockCustomerData)

      expect(result).toMatchObject({
        id: expect.any(String),
        customerNumber: mockCustomerData.customerNumber,
        name: mockCustomerData.name,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })
  })

  describe('get-customers', () => {
    it('should return a list of customers', async () => {
      const mockedDataList = [] as Prisma.CustomerCreateManyInput[]

      for (let i = 0; i < 3; i++) {
        mockedDataList.push(generateMockCustomer())
      }

      await prisma.customer.createMany({
        data: mockedDataList,
      })

      const result = await proxy.service.getCustomers()

      expect(result.length).toEqual(mockedDataList.length)
      expect(result[0]).toMatchObject({
        id: expect.any(String),
        customerNumber: mockedDataList[0].customerNumber,
        name: mockedDataList[0].name,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
      expect(result[1]).toMatchObject({
        id: expect.any(String),
        customerNumber: mockedDataList[1].customerNumber,
        name: mockedDataList[1].name,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
      expect(result[2]).toMatchObject({
        id: expect.any(String),
        customerNumber: mockedDataList[2].customerNumber,
        name: mockedDataList[2].name,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })
  })

  describe('get-customer-by-number', () => {
    it('should return a customer by number', async () => {
      await prisma.customer.create({
        data: mockCustomerData,
      })

      const result = await proxy.service.getCustomerByNumber(
        mockCustomerData.customerNumber as bigint,
      )

      expect(result).toMatchObject({
        id: expect.any(String),
        customerNumber: mockCustomerData.customerNumber,
        name: mockCustomerData.name,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should return null if customer not found', async () => {
      const customerNumber = 1234567890n
      const result = await proxy.service.getCustomerByNumber(customerNumber)
      expect(result).toBeNull()
    })
  })

  describe('get-total-customers', () => {
    it('should return the total number of customers', async () => {
      const mockedDataList = [] as Prisma.CustomerCreateManyInput[]

      for (let i = 0; i < 3; i++) {
        mockedDataList.push(generateMockCustomer())
      }

      await prisma.customer.createMany({
        data: mockedDataList,
      })

      const result = await proxy.service.getTotalCustomers()
      expect(result.total).toEqual(mockedDataList.length)
    })
  })
})
