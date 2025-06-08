import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  CannotCancelOrderException,
  NotFoundCartItemException,
  OrderNotFoundException,
  OutOfStockSKUException,
  ProductNotFoundException,
  SKUNotBelongToShopException
} from 'src/routes/order/order.error'
import {
  CancelOrderResType,
  CreateOrderBodyType,
  CreateOrderResType,
  GetOrderDetailResType,
  GetOrderListQueryType,
  GetOrderListResType
} from 'src/routes/order/order.model'
import { OrderStatus } from 'src/shared/constants/order.constant'
import { isRecordNotFoundPrismaError } from 'src/shared/helpers'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class OrderRepo {
  constructor(private readonly prismaService: PrismaService) {}
  async list(userId: number, query: GetOrderListQueryType): Promise<GetOrderListResType> {
    const { page, limit, status } = query
    const skip = (page - 1) * limit
    const take = limit
    const where: Prisma.OrderWhereInput = {
      userId,
      status
    }

    const $totalItem = this.prismaService.order.count({
      where
    })

    const $data = await this.prismaService.order.findMany({
      where,
      include: {
        items: true
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc'
      }
    })
    const [data, totalItems] = await Promise.all([$data, $totalItem])
    return {
      data,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  async create(userId: number, body: CreateOrderBodyType): Promise<CreateOrderResType> {
    const allBodyCartItemIds = body.map((item) => item.cartItemIds).flat()
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        id: {
          in: allBodyCartItemIds
        },
        userId
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                productTranslations: true
              }
            }
          }
        }
      }
    })
    // Check if all cartItemIds exist in the database
    if (cartItems.length !== allBodyCartItemIds.length) {
      throw NotFoundCartItemException
    }

    // Check if the purchase quantity is greater than the stock quantity
    const isOutOfStock = cartItems.some((item) => {
      return item.sku.stock < item.quantity
    })
    if (isOutOfStock) {
      throw OutOfStockSKUException
    }

    // Check if all purchased products have been deleted or unpublished
    const isExistNotReadyProduct = cartItems.some(
      (item) =>
        item.sku.product.deletedAt !== null ||
        item.sku.product.publishedAt === null ||
        item.sku.product.publishedAt > new Date()
    )
    if (isExistNotReadyProduct) {
      throw ProductNotFoundException
    }

    // Check if the skuId in the cartItem sent belongs to the shopId sent
    const cartItemMap = new Map<number, (typeof cartItems)[number]>()
    cartItems.forEach((item) => {
      cartItemMap.set(item.id, item)
    })
    const isValidShop = body.every((item) => {
      const bodyCartItemIds = item.cartItemIds
      return bodyCartItemIds.every((cartItemId) => {
        const cartItem = cartItemMap.get(cartItemId)!
        return item.shopId === cartItem.sku.createdById
      })
    })
    if (!isValidShop) {
      throw SKUNotBelongToShopException
    }

    // Create order and delete cartItem in transaction to ensure data integrity
    const orders = await this.prismaService.$transaction(async (tx) => {
      const orders = await Promise.all(
        body.map((item) =>
          tx.order.create({
            data: {
              userId,
              status: OrderStatus.PENDING_PAYMENT,
              receiver: item.receiver,
              createdById: userId,
              shopId: item.shopId,
              items: {
                create: item.cartItemIds.map((cartItemId) => {
                  const cartItem = cartItemMap.get(cartItemId)!
                  return {
                    productName: cartItem.sku.product.name,
                    skuPrice: cartItem.sku.price,
                    image: cartItem.sku.image,
                    skuId: cartItem.sku.id,
                    skuValue: cartItem.sku.value,
                    quantity: cartItem.quantity,
                    productId: cartItem.sku.product.id,
                    productTranslations: cartItem.sku.product.productTranslations.map((translation) => {
                      return {
                        id: translation.id,
                        name: translation.name,
                        description: translation.description,
                        languageId: translation.languageId
                      }
                    })
                  }
                })
              },
              products: {
                connect: item.cartItemIds.map((cartItemId) => {
                  const cartItem = cartItemMap.get(cartItemId)!
                  return {
                    id: cartItem.sku.product.id
                  }
                })
              }
            }
          })
        )
      )
      await tx.cartItem.deleteMany({
        where: {
          id: {
            in: allBodyCartItemIds
          }
        }
      })
      return orders
    })
    return {
      data: orders
    }
  }

  async detail(userId: number, orderId: number): Promise<GetOrderDetailResType> {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: orderId,
        userId,
        deletedAt: null
      },
      include: {
        items: true
      }
    })
    if (!order) {
      throw OrderNotFoundException
    }
    return order
  }

  async cancel(userId: number, orderId: number): Promise<CancelOrderResType> {
    try {
      const order = await this.prismaService.order.findUniqueOrThrow({
        where: {
          id: orderId,
          userId,
          deletedAt: null
        }
      })
      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw CannotCancelOrderException
      }

      const updatedOrder = await this.prismaService.order.update({
        where: {
          id: orderId,
          userId,
          deletedAt: null
        },
        data: {
          status: OrderStatus.CANCELLED,
          updatedById: userId
        }
      })
      return updatedOrder
    } catch (error) {
      if (isRecordNotFoundPrismaError(error)) {
        throw OrderNotFoundException
      }
      throw error
    }
  }
}
