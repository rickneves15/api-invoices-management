import { Injectable } from '@nestjs/common'
import { Invoice } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

import { sortByMonth } from '~/lib/date'

import { GetEnergyStatsResponseDto } from './dtos/get-energy-stats'
import { GetEnergyValuesResponseDto } from './dtos/get-energy-values'
import { GetTotalEnergyCompensatedResponseDto } from './dtos/get-total-energy-compensated'
import { GetTotalEnergyConsumptionResponseDto } from './dtos/get-total-energy-consumption'

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getEnergyStats(
    customerNumber?: bigint,
  ): Promise<GetEnergyStatsResponseDto[]> {
    const invoices: Invoice[] = await this.prisma.invoice.findMany({
      where: {
        customerId: customerNumber,
      },
    })

    const energyStats: GetEnergyStatsResponseDto = {}

    invoices.forEach((invoice) => {
      const {
        referenceMonth,
        energyQuantity,
        exemptEnergyQuantity,
        compensatedEnergyQuantity,
      } = invoice

      if (!energyStats[referenceMonth]) {
        energyStats[referenceMonth] = {
          energyConsumption: 0,
          energyCompensated: 0,
        }
      }

      const energyConsumption =
        Number(energyQuantity) + (Number(exemptEnergyQuantity) || 0)
      const energyCompensated = compensatedEnergyQuantity || 0

      energyStats[referenceMonth].energyConsumption += energyConsumption
      energyStats[referenceMonth].energyCompensated += Number(energyCompensated)
    })

    const data = Object.keys(energyStats)
      .map((referenceMonth) => ({
        referenceMonth,
        energyConsumption: energyStats[referenceMonth].energyConsumption,
        energyCompensated: energyStats[referenceMonth].energyCompensated,
      }))
      .sort(sortByMonth)

    return data
  }

  async getEnergyValues(
    customerNumber?: bigint,
  ): Promise<GetEnergyValuesResponseDto[]> {
    const invoices: Invoice[] = await this.prisma.invoice.findMany({
      where: {
        customerId: customerNumber,
      },
    })

    const energyValues: GetEnergyValuesResponseDto = {}

    invoices.forEach((invoice) => {
      const {
        referenceMonth,
        energyAmount,
        exemptEnergyAmount,
        municipalPublicLightingContribution,
        compensatedEnergyAmount,
      } = invoice

      if (!energyValues[referenceMonth]) {
        energyValues[referenceMonth] = {
          consumedEnergyValue: 0,
          compensatedEnergyValue: 0,
        }
      }

      const consumedEnergyValue =
        Number(energyAmount) +
        Number(exemptEnergyAmount || 0) +
        Number(municipalPublicLightingContribution)
      const compensatedEnergyValue = Number(compensatedEnergyAmount) || 0

      energyValues[referenceMonth].consumedEnergyValue += consumedEnergyValue
      energyValues[referenceMonth].compensatedEnergyValue +=
        compensatedEnergyValue
    })

    const data = Object.keys(energyValues)
      .map((referenceMonth) => ({
        referenceMonth,
        consumedEnergyValue: energyValues[referenceMonth].consumedEnergyValue,
        compensatedEnergyValue:
          energyValues[referenceMonth].compensatedEnergyValue,
      }))
      .sort(sortByMonth)

    return data
  }

  async getTotalEnergyCompensated(): Promise<GetTotalEnergyCompensatedResponseDto> {
    const invoices: Invoice[] = await this.prisma.invoice.findMany()

    let total = 0

    invoices.forEach((invoice) => {
      total += Number(invoice.compensatedEnergyQuantity) || 0
    })

    return { total }
  }

  async getTotalEnergyConsumption(): Promise<GetTotalEnergyConsumptionResponseDto> {
    const invoices: Invoice[] = await this.prisma.invoice.findMany()

    let total = 0

    invoices.forEach((invoice) => {
      total +=
        Number(invoice.energyQuantity) +
        (Number(invoice.exemptEnergyQuantity) || 0)
    })

    return { total }
  }
}
