import { PrismaClient } from '../generated/prisma/client.js';
import { AuditService } from '../audit/audit.service.js';
import { WarehousesService } from '../inventory/warehouses/warehouses.service.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { ProductsService } from '../catalog/products/products.service.js';
import { CategoriesService } from '../catalog/categories/categories.service.js';
import { CollectionsService } from '../catalog/collections/collections.service.js';
import { ProductTypesService } from '../catalog/product-types/product-types.service.js';
import { VariantsService } from '../catalog/variants/variants.service.js';
import { OptionsService } from '../catalog/options/options.service.js';
import { PricingService } from '../catalog/pricing/pricing.service.js';
import { CartService } from '../commerce/cart/cart.service.js';
import { DiscountsService } from '../growth/discounts/discounts.service.js';
import { PromotionsService } from '../growth/promotions/promotions.service.js';
import { CustomerSegmentsService } from '../growth/customer-segments/customer-segments.service.js';
import { CampaignsService } from '../growth/campaigns/campaigns.service.js';
import { AbandonedCartsService } from '../growth/abandoned-carts/abandoned-carts.service.js';
import { OrdersService } from '../commerce/orders/orders.service.js';
import { ReturnsReplacementsService } from '../commerce/returns-replacements/returns-replacements.service.js';
import { UsersService } from '../users/users.service.js';
import { RolesService } from '../roles/roles.service.js';
import { CustomersService } from '../customers/customers.service.js';
import { SlaService } from '../production/sla/sla.service.js';
import { JobsService } from '../production/jobs/jobs.service.js';
import { MachinesService } from '../production/machines/machines.service.js';
import { MaterialsService } from '../production/materials/materials.service.js';
import { StagesService } from '../production/stages/stages.service.js';
import { BatchesService } from '../production/batches/batches.service.js';
import { BomService } from '../production/bom/bom.service.js';
import { ShippingService } from '../shipping/shipping.service.js';
import { StubCourierAdapter } from '../shipping/adapters/stub-courier.adapter.js';
import { NdrRtoService } from '../shipping/ndr-rto/ndr-rto.service.js';
import { AnalyticsService } from '../analytics/analytics.service.js';
import { DesignsService } from '../customization/designs/designs.service.js';
import { PaymentsService } from '../payments/payments.service.js';

export interface ServicesContainer {
  audit: AuditService;
  warehouses: WarehousesService;
  inventory: InventoryService;
  products: ProductsService;
  categories: CategoriesService;
  collections: CollectionsService;
  productTypes: ProductTypesService;
  variants: VariantsService;
  options: OptionsService;
  pricing: PricingService;
  cart: CartService;
  discounts: DiscountsService;
  promotions: PromotionsService;
  customerSegments: CustomerSegmentsService;
  campaigns: CampaignsService;
  abandonedCarts: AbandonedCartsService;
  orders: OrdersService;
  returnsReplacements: ReturnsReplacementsService;
  users: UsersService;
  roles: RolesService;
  customers: CustomersService;
  sla: SlaService;
  jobs: JobsService;
  machines: MachinesService;
  materials: MaterialsService;
  stages: StagesService;
  batches: BatchesService;
  bom: BomService;
  shipping: ShippingService;
  ndrRto: NdrRtoService;
  analytics: AnalyticsService;
  designs: DesignsService;
  payments: PaymentsService;
}

export function createServicesContainer(prismaClient: PrismaClient): ServicesContainer {
  const prisma = prismaClient as any;

  const audit = new AuditService(prisma);
  const warehouses = new WarehousesService(prisma);
  const inventory = new InventoryService(prisma);
  const products = new ProductsService(prisma, audit);
  const categories = new CategoriesService(prisma);
  const collections = new CollectionsService(prisma);
  const productTypes = new ProductTypesService(prisma);
  const variants = new VariantsService(prisma);
  const options = new OptionsService(prisma);
  const pricing = new PricingService(prisma);
  const customerSegments = new CustomerSegmentsService(prisma);
  const discounts = new DiscountsService(prisma, customerSegments);
  const promotions = new PromotionsService(prisma, customerSegments);
  const campaigns = new CampaignsService(prisma, audit, customerSegments);
  const abandonedCarts = new AbandonedCartsService(prisma, discounts);
  const cart = new CartService(prisma, pricing, discounts);
  const orders = new OrdersService(prisma, cart, inventory, audit, discounts, abandonedCarts);
  const sla = new SlaService(prisma);
  const jobs = new JobsService(prisma, sla);
  const returnsReplacements = new ReturnsReplacementsService(prisma, jobs, orders);
  const users = new UsersService(prisma, audit);
  const roles = new RolesService(prisma);
  const customers = new CustomersService(prisma);
  const machines = new MachinesService(prisma);
  const materials = new MaterialsService(prisma);
  const stages = new StagesService(prisma, materials);
  const batches = new BatchesService(prisma);
  const bom = new BomService(prisma);
  const courier = new StubCourierAdapter();
  const shipping = new ShippingService(prisma, courier);
  const ndrRto = new NdrRtoService(prisma, inventory);
  const analytics = new AnalyticsService(prisma);
  const designs = new DesignsService(prisma);
  const payments = new PaymentsService(prisma);

  return {
    audit,
    warehouses,
    inventory,
    products,
    categories,
    collections,
    productTypes,
    variants,
    options,
    pricing,
    cart,
    discounts,
    promotions,
    customerSegments,
    campaigns,
    abandonedCarts,
    orders,
    returnsReplacements,
    users,
    roles,
    customers,
    sla,
    jobs,
    machines,
    materials,
    stages,
    batches,
    bom,
    shipping,
    ndrRto,
    analytics,
    designs,
    payments,
  };
}
