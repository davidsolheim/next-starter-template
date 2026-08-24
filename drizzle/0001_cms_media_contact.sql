CREATE TYPE "media_kind" AS ENUM ('image', 'video', 'document');
--> statement-breakpoint
CREATE TYPE "cms_entry_type" AS ENUM ('page', 'article');
--> statement-breakpoint
CREATE TYPE "cms_entry_status" AS ENUM ('draft', 'in_review', 'published');
--> statement-breakpoint
CREATE TABLE "locales" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_locales_code" ON "locales" USING btree ("code");
--> statement-breakpoint
INSERT INTO "locales" ("id", "code", "name", "is_default") VALUES ('locale_en', 'en', 'English', true);
--> statement-breakpoint
CREATE TABLE "rate_limit_buckets" (
	"key" text PRIMARY KEY NOT NULL,
	"request_count" integer DEFAULT 0 NOT NULL,
	"reset_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_inquiries" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_contact_inquiries_email" ON "contact_inquiries" USING btree ("email");
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"storage_url" text NOT NULL,
	"storage_key" text NOT NULL,
	"thumbnail_url" text,
	"thumbnail_key" text,
	"filename" text NOT NULL,
	"title" text,
	"description" text,
	"source_credit" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"content_type" text,
	"size_bytes" integer,
	"width" integer,
	"height" integer,
	"focal_x" integer,
	"focal_y" integer,
	"kind" "media_kind" DEFAULT 'image' NOT NULL,
	"alt_text" text,
	"locale_id" text,
	"uploaded_by_user_id" text,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "uq_media_assets_storage_key" ON "media_assets" USING btree ("storage_key");
--> statement-breakpoint
CREATE INDEX "idx_media_assets_kind" ON "media_assets" USING btree ("kind");
--> statement-breakpoint
CREATE INDEX "idx_media_assets_archived" ON "media_assets" USING btree ("archived_at");
--> statement-breakpoint
CREATE TABLE "media_usages" (
	"id" text PRIMARY KEY NOT NULL,
	"asset_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"field_key" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_media_usages_asset" ON "media_usages" USING btree ("asset_id");
--> statement-breakpoint
CREATE INDEX "idx_media_usages_entity" ON "media_usages" USING btree ("entity_type","entity_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "uq_media_usages_entity_field_asset" ON "media_usages" USING btree ("entity_type","entity_id","field_key","asset_id");
--> statement-breakpoint
CREATE TABLE "cms_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"entry_type" "cms_entry_type" NOT NULL,
	"locale_id" text NOT NULL,
	"slug" text NOT NULL,
	"route_path" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"body" text DEFAULT '' NOT NULL,
	"hero_media_id" text,
	"status" "cms_entry_status" DEFAULT 'draft' NOT NULL,
	"source_entry_id" text,
	"translations_stale" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_by_user_id" text,
	"updated_by_user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_cms_entries_locale_type_slug" ON "cms_entries" USING btree ("locale_id","entry_type","slug");
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_cms_entries_locale_route" ON "cms_entries" USING btree ("locale_id","route_path");
--> statement-breakpoint
CREATE INDEX "idx_cms_entries_status" ON "cms_entries" USING btree ("status");
--> statement-breakpoint
CREATE TABLE "cms_revisions" (
	"id" text PRIMARY KEY NOT NULL,
	"entry_id" text NOT NULL,
	"revision_number" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_by_user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_cms_revisions_entry_revision" ON "cms_revisions" USING btree ("entry_id","revision_number");
--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_locale_id_locales_id_fk" FOREIGN KEY ("locale_id") REFERENCES "public"."locales"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "media_usages" ADD CONSTRAINT "media_usages_asset_id_media_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "cms_entries" ADD CONSTRAINT "cms_entries_locale_id_locales_id_fk" FOREIGN KEY ("locale_id") REFERENCES "public"."locales"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "cms_entries" ADD CONSTRAINT "cms_entries_hero_media_id_media_assets_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "cms_revisions" ADD CONSTRAINT "cms_revisions_entry_id_cms_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."cms_entries"("id") ON DELETE cascade ON UPDATE no action;
