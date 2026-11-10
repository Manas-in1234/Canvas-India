INSERT INTO "pricing_settings" ("key", "value", "description", "updated_at")
SELECT material || '_shape_area_rate_per_sqin',
       COALESCE((SELECT "value" FROM "pricing_settings" WHERE "key" = 'shape_area_rate_per_sqin'), 1.65),
       initcap(material) || ' non-rectangular shape surcharge per square inch',
       CURRENT_TIMESTAMP
FROM (VALUES ('canvas'), ('acrylic')) AS materials(material)
ON CONFLICT ("key") DO NOTHING;
