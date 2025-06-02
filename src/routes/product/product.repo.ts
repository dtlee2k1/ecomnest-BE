/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  CreateProductBodyType,
  GetProductDetailResType,
  GetProductsResType,
  UpdateProductBodyType
} from 'src/routes/product/product.model'
import { ALL_LANGUAGE_CODE, OrderByType, SortBy, SortByType } from 'src/shared/constants/other.constant'
import { ProductType } from 'src/shared/models/shared-product.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class ProductRepo {
  constructor(private prismaService: PrismaService) {}

  async list({
    limit,
    page,
    name,
    brandIds,
    categories,
    minPrice,
    maxPrice,
    createdById,
    isPublic,
    languageId,
    orderBy,
    sortBy
  }: {
    limit: number
    page: number
    name?: string
    brandIds?: number[]
    categories?: number[]
    minPrice?: number
    maxPrice?: number
    createdById?: number
    isPublic?: boolean
    languageId: string
    orderBy: OrderByType
    sortBy: SortByType
  }): Promise<GetProductsResType> {
    const skip = (page - 1) * limit
    const take = limit

    let where: Prisma.ProductWhereInput = {
      deletedAt: null,
      createdById: createdById ? createdById : undefined
    }
    if (isPublic === true) {
      where.publishedAt = {
        lte: new Date(),
        not: null
      }
    } else if (isPublic === false) {
      where = {
        ...where,
        OR: [{ publishedAt: null }, { publishedAt: { gt: new Date() } }]
      }
    }

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive'
      }
    }

    if (brandIds && brandIds.length > 0) {
      where.brandId = {
        in: brandIds
      }
    }

    if (categories && categories.length > 0) {
      where.categories = {
        some: {
          id: {
            in: categories
          },
          deletedAt: null
        }
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {
        gte: minPrice,
        lte: maxPrice
      }
    }

    let orderByClause: Prisma.ProductOrderByWithRelationInput = {
      createdAt: orderBy
    }

    if (sortBy === SortBy.Price) {
      orderByClause = {
        basePrice: orderBy
      }
    } else if (sortBy === SortBy.Sale) {
      orderByClause = {
        orders: {
          _count: orderBy
        }
      }
    }

    const [totalItems, data] = await Promise.all([
      this.prismaService.product.count({
        where
      }),
      this.prismaService.product.findMany({
        where,
        include: {
          productTranslations: {
            where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { deletedAt: null, languageId }
          },
          orders: {
            where: {
              deletedAt: null,
              status: 'DELIVERED'
            }
          }
        },
        orderBy: orderByClause,
        skip,
        take
      })
    ])

    return {
      data,
      totalItems,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  findById(productId: number): Promise<ProductType | null> {
    return this.prismaService.product.findUnique({
      where: {
        id: productId,
        deletedAt: null
      }
    })
  }

  async getDetail({
    productId,
    languageId,
    isPublic
  }: {
    productId: number
    languageId: string
    isPublic?: boolean
  }): Promise<GetProductDetailResType | null> {
    let where: Prisma.ProductWhereUniqueInput = {
      id: productId,
      deletedAt: null
    }
    if (isPublic === true) {
      where.publishedAt = {
        lte: new Date(),
        not: null
      }
    } else if (isPublic === false) {
      where = {
        ...where,
        OR: [{ publishedAt: null }, { publishedAt: { gt: new Date() } }]
      }
    }

    return this.prismaService.product.findUnique({
      where,
      include: {
        productTranslations: {
          where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { deletedAt: null, languageId }
        },
        skus: {
          where: { deletedAt: null }
        },
        categories: {
          include: {
            categoryTranslations: {
              where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { deletedAt: null, languageId }
            }
          }
        },
        brand: {
          include: {
            brandTranslations: {
              where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { deletedAt: null, languageId }
            }
          }
        }
      }
    })
  }

  async create({
    createdById,
    data
  }: {
    createdById: number
    data: CreateProductBodyType
  }): Promise<GetProductDetailResType> {
    const { skus, categories, ...productData } = data

    return this.prismaService.product.create({
      data: {
        ...productData,
        createdById,
        skus: {
          createMany: {
            data: skus.map((sku) => ({
              ...sku,
              createdById
            }))
          }
        },
        categories: {
          connect: categories.map((categoryId) => ({ id: categoryId }))
        }
      },
      include: {
        productTranslations: {
          where: { deletedAt: null }
        },
        skus: {
          where: { deletedAt: null }
        },
        categories: {
          where: { deletedAt: null },
          include: {
            categoryTranslations: {
              where: { deletedAt: null }
            }
          }
        },
        brand: {
          include: {
            brandTranslations: {
              where: { deletedAt: null }
            }
          }
        }
      }
    })
  }

  async update({
    id,
    updatedById,
    data
  }: {
    id: number
    updatedById: number
    data: UpdateProductBodyType
  }): Promise<ProductType> {
    const { skus: dataSkus, categories, ...productData } = data
    // SKUs that exist in the DB but are not in the data payload will be deleted
    // SKUs that exist in the DB and are in the data payload will be updated
    // SKUs that do not exist in the DB but are in the data payload will be created

    // Get the current list of SKUs in the database
    const existingSKUs = await this.prismaService.sKU.findMany({
      where: {
        productId: id,
        deletedAt: null
      }
    })

    // Find SKUs to delete (exist in DB but not in data payload)
    const skusToDelete = existingSKUs.filter((sku) => dataSkus.every((dataSku) => dataSku.value !== sku.value))
    const skuIdsToDelete = skusToDelete.map((sku) => sku.id)

    // Map IDs into the data payload
    const skusWithId = dataSkus.map((dataSku) => {
      const existingSku = existingSKUs.find((existingSKU) => existingSKU.value === dataSku.value)
      return {
        ...dataSku,
        id: existingSku ? existingSku.id : null
      }
    })

    // Find SKUs to update
    const skusToUpdate = skusWithId.filter((sku) => sku.id !== null)

    // Find SKUs to create
    const skusToCreate = skusWithId
      .filter((sku) => sku.id === null)
      .map((sku) => {
        const { id: skuId, ...data } = sku
        return {
          ...data,
          productId: id,
          createdById: updatedById
        }
      })

    const [product] = await this.prismaService.$transaction([
      this.prismaService.product.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...productData,
          updatedById,
          categories: {
            connect: categories.map((category) => ({ id: category }))
          }
        }
      }),
      // Soft delete SKUs that are not in the data payload
      this.prismaService.sKU.updateMany({
        where: {
          id: {
            in: skuIdsToDelete
          }
        },
        data: {
          deletedAt: new Date(),
          deletedById: updatedById
        }
      }),
      // Update SKUs that exist in the DB and are in the data payload
      ...skusToUpdate.map((sku) =>
        this.prismaService.sKU.update({
          where: {
            id: sku.id as number
          },
          data: {
            value: sku.value,
            price: sku.price,
            stock: sku.stock,
            image: sku.image,
            updatedById
          }
        })
      ),
      // Create new SKUs that do not exist in the DB
      this.prismaService.sKU.createMany({
        data: skusToCreate
      })
    ])

    return product
  }

  async delete(
    { productId, deletedById }: { productId: number; deletedById: number | null },
    isHard?: boolean
  ): Promise<ProductType> {
    if (isHard) {
      return this.prismaService.product.delete({
        where: {
          id: productId
        }
      })
    }

    const now = new Date()
    const [product] = await Promise.all([
      this.prismaService.product.update({
        where: {
          id: productId
        },
        data: {
          deletedById,
          deletedAt: now
        }
      }),
      this.prismaService.productTranslation.updateMany({
        where: {
          productId,
          deletedAt: null
        },
        data: {
          deletedById,
          deletedAt: now
        }
      }),
      this.prismaService.sKU.updateMany({
        where: {
          productId
        },
        data: {
          deletedById,
          deletedAt: now
        }
      })
    ])
    return product
  }
}
