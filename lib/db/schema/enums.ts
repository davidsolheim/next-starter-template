import { pgEnum } from "drizzle-orm/pg-core"

export const membershipRole = pgEnum("membership_role", [
  "owner",
  "admin",
  "member",
])

export const inviteStatus = pgEnum("invite_status", [
  "pending",
  "accepted",
  "revoked",
  "expired",
])

export const subscriptionStatus = pgEnum("subscription_status", [
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
])

export const auditAction = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "login",
  "logout",
  "invite",
  "billing",
])

export const notificationChannel = pgEnum("notification_channel", [
  "in_app",
  "email",
  "sms",
  "webhook",
])

export const apiKeyStatus = pgEnum("api_key_status", ["active", "revoked"])

// Ecommerce enums
export const orderStatus = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
])

export const fulfillmentStatus = pgEnum("fulfillment_status", [
  "unfulfilled",
  "partial",
  "fulfilled",
  "returned",
])

export const discountType = pgEnum("discount_type", [
  "percentage",
  "fixed_amount",
  "free_shipping",
])

export const productType = pgEnum("product_type", [
  "physical",
  "digital",
  "service",
])

export const addressType = pgEnum("address_type", [
  "shipping",
  "billing",
])

export const refundStatus = pgEnum("refund_status", [
  "pending",
  "approved",
  "rejected",
  "completed",
])
