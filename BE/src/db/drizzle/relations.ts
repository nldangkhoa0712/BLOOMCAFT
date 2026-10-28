import { relations } from "drizzle-orm/relations";
import { ingredientsInInventory, bouquetRecipeItemsInInventory, bouquetRecipesInInventory, productsInCatalog, productRecipesInCatalog, usersInIdentity, bouquetDesignsInAiDesigner, bouquetDesignVersionsInAiDesigner, aiGenerationLogsInAiDesigner, cartsInCommerce, cartItemsInCommerce, ordersInCommerce, userAddressesInIdentity, refreshTokensInIdentity, categoriesInCatalog, productImagesInCatalog, inventoryBalancesInInventory, finishedGoodsInventoryInInventory, orderItemsInCommerce, orderStatusHistoriesInCommerce, inventoryTransactionsInInventory, inventoryReservationsInInventory, flowerJourneysInFulfillment, journeyStepsInFulfillment, floristAssignmentsInFulfillment, journeyPhotosInFulfillment, qualityChecksInFulfillment, productCategoriesInCatalog, rolesInIdentity, userRolesInIdentity } from "./schema";

export const bouquetRecipeItemsInInventoryRelations = relations(bouquetRecipeItemsInInventory, ({one}) => ({
	ingredientsInInventory: one(ingredientsInInventory, {
		fields: [bouquetRecipeItemsInInventory.ingredientId],
		references: [ingredientsInInventory.id]
	}),
	bouquetRecipesInInventory: one(bouquetRecipesInInventory, {
		fields: [bouquetRecipeItemsInInventory.recipeId],
		references: [bouquetRecipesInInventory.id]
	}),
}));

export const ingredientsInInventoryRelations = relations(ingredientsInInventory, ({many}) => ({
	bouquetRecipeItemsInInventories: many(bouquetRecipeItemsInInventory),
	inventoryBalancesInInventories: many(inventoryBalancesInInventory),
	inventoryTransactionsInInventories: many(inventoryTransactionsInInventory),
	inventoryReservationsInInventories: many(inventoryReservationsInInventory),
}));

export const bouquetRecipesInInventoryRelations = relations(bouquetRecipesInInventory, ({many}) => ({
	bouquetRecipeItemsInInventories: many(bouquetRecipeItemsInInventory),
	productRecipesInCatalogs: many(productRecipesInCatalog),
	bouquetDesignVersionsInAiDesigners: many(bouquetDesignVersionsInAiDesigner),
}));

export const productRecipesInCatalogRelations = relations(productRecipesInCatalog, ({one}) => ({
	productsInCatalog: one(productsInCatalog, {
		fields: [productRecipesInCatalog.productId],
		references: [productsInCatalog.id]
	}),
	bouquetRecipesInInventory: one(bouquetRecipesInInventory, {
		fields: [productRecipesInCatalog.recipeId],
		references: [bouquetRecipesInInventory.id]
	}),
}));

export const productsInCatalogRelations = relations(productsInCatalog, ({many}) => ({
	productRecipesInCatalogs: many(productRecipesInCatalog),
	cartItemsInCommerces: many(cartItemsInCommerce),
	productImagesInCatalogs: many(productImagesInCatalog),
	finishedGoodsInventoryInInventories: many(finishedGoodsInventoryInInventory),
	orderItemsInCommerces: many(orderItemsInCommerce),
	inventoryTransactionsInInventories: many(inventoryTransactionsInInventory),
	inventoryReservationsInInventories: many(inventoryReservationsInInventory),
	productCategoriesInCatalogs: many(productCategoriesInCatalog),
}));

export const bouquetDesignsInAiDesignerRelations = relations(bouquetDesignsInAiDesigner, ({one, many}) => ({
	usersInIdentity: one(usersInIdentity, {
		fields: [bouquetDesignsInAiDesigner.userId],
		references: [usersInIdentity.id]
	}),
	bouquetDesignVersionsInAiDesigners: many(bouquetDesignVersionsInAiDesigner),
	aiGenerationLogsInAiDesigners: many(aiGenerationLogsInAiDesigner),
}));

export const usersInIdentityRelations = relations(usersInIdentity, ({many}) => ({
	bouquetDesignsInAiDesigners: many(bouquetDesignsInAiDesigner),
	cartsInCommerces: many(cartsInCommerce),
	ordersInCommerces: many(ordersInCommerce),
	userAddressesInIdentities: many(userAddressesInIdentity),
	refreshTokensInIdentities: many(refreshTokensInIdentity),
	orderStatusHistoriesInCommerces: many(orderStatusHistoriesInCommerce),
	inventoryTransactionsInInventories: many(inventoryTransactionsInInventory),
	journeyStepsInFulfillments: many(journeyStepsInFulfillment),
	floristAssignmentsInFulfillments_assignedBy: many(floristAssignmentsInFulfillment, {
		relationName: "floristAssignmentsInFulfillment_assignedBy_usersInIdentity_id"
	}),
	floristAssignmentsInFulfillments_floristId: many(floristAssignmentsInFulfillment, {
		relationName: "floristAssignmentsInFulfillment_floristId_usersInIdentity_id"
	}),
	journeyPhotosInFulfillments: many(journeyPhotosInFulfillment),
	qualityChecksInFulfillments: many(qualityChecksInFulfillment),
	userRolesInIdentities: many(userRolesInIdentity),
}));

export const bouquetDesignVersionsInAiDesignerRelations = relations(bouquetDesignVersionsInAiDesigner, ({one, many}) => ({
	bouquetDesignsInAiDesigner: one(bouquetDesignsInAiDesigner, {
		fields: [bouquetDesignVersionsInAiDesigner.designId],
		references: [bouquetDesignsInAiDesigner.id]
	}),
	bouquetRecipesInInventory: one(bouquetRecipesInInventory, {
		fields: [bouquetDesignVersionsInAiDesigner.recipeId],
		references: [bouquetRecipesInInventory.id]
	}),
	aiGenerationLogsInAiDesigners: many(aiGenerationLogsInAiDesigner),
	orderItemsInCommerces: many(orderItemsInCommerce),
}));

export const aiGenerationLogsInAiDesignerRelations = relations(aiGenerationLogsInAiDesigner, ({one}) => ({
	bouquetDesignsInAiDesigner: one(bouquetDesignsInAiDesigner, {
		fields: [aiGenerationLogsInAiDesigner.designId],
		references: [bouquetDesignsInAiDesigner.id]
	}),
	bouquetDesignVersionsInAiDesigner: one(bouquetDesignVersionsInAiDesigner, {
		fields: [aiGenerationLogsInAiDesigner.versionId],
		references: [bouquetDesignVersionsInAiDesigner.id]
	}),
}));

export const cartsInCommerceRelations = relations(cartsInCommerce, ({one, many}) => ({
	usersInIdentity: one(usersInIdentity, {
		fields: [cartsInCommerce.userId],
		references: [usersInIdentity.id]
	}),
	cartItemsInCommerces: many(cartItemsInCommerce),
}));

export const cartItemsInCommerceRelations = relations(cartItemsInCommerce, ({one}) => ({
	cartsInCommerce: one(cartsInCommerce, {
		fields: [cartItemsInCommerce.cartId],
		references: [cartsInCommerce.id]
	}),
	productsInCatalog: one(productsInCatalog, {
		fields: [cartItemsInCommerce.productId],
		references: [productsInCatalog.id]
	}),
}));

export const ordersInCommerceRelations = relations(ordersInCommerce, ({one, many}) => ({
	usersInIdentity: one(usersInIdentity, {
		fields: [ordersInCommerce.userId],
		references: [usersInIdentity.id]
	}),
	orderItemsInCommerces: many(orderItemsInCommerce),
	orderStatusHistoriesInCommerces: many(orderStatusHistoriesInCommerce),
	inventoryReservationsInInventories: many(inventoryReservationsInInventory),
	flowerJourneysInFulfillments: many(flowerJourneysInFulfillment),
}));

export const userAddressesInIdentityRelations = relations(userAddressesInIdentity, ({one}) => ({
	usersInIdentity: one(usersInIdentity, {
		fields: [userAddressesInIdentity.userId],
		references: [usersInIdentity.id]
	}),
}));

export const refreshTokensInIdentityRelations = relations(refreshTokensInIdentity, ({one}) => ({
	usersInIdentity: one(usersInIdentity, {
		fields: [refreshTokensInIdentity.userId],
		references: [usersInIdentity.id]
	}),
}));

export const categoriesInCatalogRelations = relations(categoriesInCatalog, ({one, many}) => ({
	categoriesInCatalog: one(categoriesInCatalog, {
		fields: [categoriesInCatalog.parentId],
		references: [categoriesInCatalog.id],
		relationName: "categoriesInCatalog_parentId_categoriesInCatalog_id"
	}),
	categoriesInCatalogs: many(categoriesInCatalog, {
		relationName: "categoriesInCatalog_parentId_categoriesInCatalog_id"
	}),
	productCategoriesInCatalogs: many(productCategoriesInCatalog),
}));

export const productImagesInCatalogRelations = relations(productImagesInCatalog, ({one}) => ({
	productsInCatalog: one(productsInCatalog, {
		fields: [productImagesInCatalog.productId],
		references: [productsInCatalog.id]
	}),
}));

export const inventoryBalancesInInventoryRelations = relations(inventoryBalancesInInventory, ({one}) => ({
	ingredientsInInventory: one(ingredientsInInventory, {
		fields: [inventoryBalancesInInventory.ingredientId],
		references: [ingredientsInInventory.id]
	}),
}));

export const finishedGoodsInventoryInInventoryRelations = relations(finishedGoodsInventoryInInventory, ({one}) => ({
	productsInCatalog: one(productsInCatalog, {
		fields: [finishedGoodsInventoryInInventory.productId],
		references: [productsInCatalog.id]
	}),
}));

export const orderItemsInCommerceRelations = relations(orderItemsInCommerce, ({one, many}) => ({
	bouquetDesignVersionsInAiDesigner: one(bouquetDesignVersionsInAiDesigner, {
		fields: [orderItemsInCommerce.bouquetDesignVersionId],
		references: [bouquetDesignVersionsInAiDesigner.id]
	}),
	ordersInCommerce: one(ordersInCommerce, {
		fields: [orderItemsInCommerce.orderId],
		references: [ordersInCommerce.id]
	}),
	productsInCatalog: one(productsInCatalog, {
		fields: [orderItemsInCommerce.productId],
		references: [productsInCatalog.id]
	}),
	inventoryReservationsInInventories: many(inventoryReservationsInInventory),
	flowerJourneysInFulfillments: many(flowerJourneysInFulfillment),
}));

export const orderStatusHistoriesInCommerceRelations = relations(orderStatusHistoriesInCommerce, ({one}) => ({
	usersInIdentity: one(usersInIdentity, {
		fields: [orderStatusHistoriesInCommerce.changedBy],
		references: [usersInIdentity.id]
	}),
	ordersInCommerce: one(ordersInCommerce, {
		fields: [orderStatusHistoriesInCommerce.orderId],
		references: [ordersInCommerce.id]
	}),
}));

export const inventoryTransactionsInInventoryRelations = relations(inventoryTransactionsInInventory, ({one}) => ({
	usersInIdentity: one(usersInIdentity, {
		fields: [inventoryTransactionsInInventory.createdBy],
		references: [usersInIdentity.id]
	}),
	ingredientsInInventory: one(ingredientsInInventory, {
		fields: [inventoryTransactionsInInventory.ingredientId],
		references: [ingredientsInInventory.id]
	}),
	productsInCatalog: one(productsInCatalog, {
		fields: [inventoryTransactionsInInventory.productId],
		references: [productsInCatalog.id]
	}),
}));

export const inventoryReservationsInInventoryRelations = relations(inventoryReservationsInInventory, ({one}) => ({
	ingredientsInInventory: one(ingredientsInInventory, {
		fields: [inventoryReservationsInInventory.ingredientId],
		references: [ingredientsInInventory.id]
	}),
	ordersInCommerce: one(ordersInCommerce, {
		fields: [inventoryReservationsInInventory.orderId],
		references: [ordersInCommerce.id]
	}),
	orderItemsInCommerce: one(orderItemsInCommerce, {
		fields: [inventoryReservationsInInventory.orderItemId],
		references: [orderItemsInCommerce.id]
	}),
	productsInCatalog: one(productsInCatalog, {
		fields: [inventoryReservationsInInventory.productId],
		references: [productsInCatalog.id]
	}),
}));

export const flowerJourneysInFulfillmentRelations = relations(flowerJourneysInFulfillment, ({one, many}) => ({
	ordersInCommerce: one(ordersInCommerce, {
		fields: [flowerJourneysInFulfillment.orderId],
		references: [ordersInCommerce.id]
	}),
	orderItemsInCommerce: one(orderItemsInCommerce, {
		fields: [flowerJourneysInFulfillment.orderItemId],
		references: [orderItemsInCommerce.id]
	}),
	journeyStepsInFulfillments: many(journeyStepsInFulfillment),
	floristAssignmentsInFulfillments: many(floristAssignmentsInFulfillment),
}));

export const journeyStepsInFulfillmentRelations = relations(journeyStepsInFulfillment, ({one, many}) => ({
	flowerJourneysInFulfillment: one(flowerJourneysInFulfillment, {
		fields: [journeyStepsInFulfillment.journeyId],
		references: [flowerJourneysInFulfillment.id]
	}),
	usersInIdentity: one(usersInIdentity, {
		fields: [journeyStepsInFulfillment.updatedBy],
		references: [usersInIdentity.id]
	}),
	journeyPhotosInFulfillments: many(journeyPhotosInFulfillment),
	qualityChecksInFulfillments: many(qualityChecksInFulfillment),
}));

export const floristAssignmentsInFulfillmentRelations = relations(floristAssignmentsInFulfillment, ({one}) => ({
	usersInIdentity_assignedBy: one(usersInIdentity, {
		fields: [floristAssignmentsInFulfillment.assignedBy],
		references: [usersInIdentity.id],
		relationName: "floristAssignmentsInFulfillment_assignedBy_usersInIdentity_id"
	}),
	usersInIdentity_floristId: one(usersInIdentity, {
		fields: [floristAssignmentsInFulfillment.floristId],
		references: [usersInIdentity.id],
		relationName: "floristAssignmentsInFulfillment_floristId_usersInIdentity_id"
	}),
	flowerJourneysInFulfillment: one(flowerJourneysInFulfillment, {
		fields: [floristAssignmentsInFulfillment.journeyId],
		references: [flowerJourneysInFulfillment.id]
	}),
}));

export const journeyPhotosInFulfillmentRelations = relations(journeyPhotosInFulfillment, ({one}) => ({
	journeyStepsInFulfillment: one(journeyStepsInFulfillment, {
		fields: [journeyPhotosInFulfillment.stepId],
		references: [journeyStepsInFulfillment.id]
	}),
	usersInIdentity: one(usersInIdentity, {
		fields: [journeyPhotosInFulfillment.uploadedBy],
		references: [usersInIdentity.id]
	}),
}));

export const qualityChecksInFulfillmentRelations = relations(qualityChecksInFulfillment, ({one}) => ({
	usersInIdentity: one(usersInIdentity, {
		fields: [qualityChecksInFulfillment.reviewerId],
		references: [usersInIdentity.id]
	}),
	journeyStepsInFulfillment: one(journeyStepsInFulfillment, {
		fields: [qualityChecksInFulfillment.stepId],
		references: [journeyStepsInFulfillment.id]
	}),
}));

export const productCategoriesInCatalogRelations = relations(productCategoriesInCatalog, ({one}) => ({
	categoriesInCatalog: one(categoriesInCatalog, {
		fields: [productCategoriesInCatalog.categoryId],
		references: [categoriesInCatalog.id]
	}),
	productsInCatalog: one(productsInCatalog, {
		fields: [productCategoriesInCatalog.productId],
		references: [productsInCatalog.id]
	}),
}));

export const userRolesInIdentityRelations = relations(userRolesInIdentity, ({one}) => ({
	rolesInIdentity: one(rolesInIdentity, {
		fields: [userRolesInIdentity.roleId],
		references: [rolesInIdentity.id]
	}),
	usersInIdentity: one(usersInIdentity, {
		fields: [userRolesInIdentity.userId],
		references: [usersInIdentity.id]
	}),
}));

export const rolesInIdentityRelations = relations(rolesInIdentity, ({many}) => ({
	userRolesInIdentities: many(userRolesInIdentity),
}));