import type { ServicesContainer } from './services-container.js';

// Detail and queue reads already exposed by the Nest controllers must also be
// routed by the production Worker. The caller authenticates and authorizes
// before invoking load; resolving a route never touches the database.
export function resolveAdminRead(pathname: string, prisma: any, services: ServicesContainer, status?: string): {permissions:string[];load:()=>Promise<unknown>} | null {
  const base = '/api/v1';
  if (pathname === base + '/roles/permissions') return {permissions:['roles.view'],load:()=>services.roles.listPermissions()};
  if (pathname === base + '/production/jobs/board') return {permissions:['production.view'],load:()=>services.jobs.board()};
  if (pathname === base + '/customization/artwork') {
    const statuses=['PENDING','PREFLIGHT_PASSED','PREFLIGHT_WARNING','PREFLIGHT_FAILED','APPROVED','REJECTED'];
    return {permissions:['artwork.view'],load:()=>{
      if (status && !statuses.includes(status)) throw Object.assign(new Error('Invalid artwork status'),{status:400});
      return prisma.artwork.findMany({where:status?{status}:undefined,include:{designVersion:true},orderBy:{createdAt:'desc'}});
    }};
  }
  const customerOrders=pathname.match(/^\/api\/v1\/customers\/([^/]+)\/orders$/);
  if (customerOrders) return {permissions:['customers.view','orders.view'],load:()=>prisma.order.findMany({where:{customerId:customerOrders[1]},include:{customer:{select:{id:true,name:true}}},orderBy:{createdAt:'desc'}})};
  const routes: [RegExp,string[],(id:string)=>Promise<unknown>][] = [
    [/^\/api\/v1\/customers\/([^/]+)$/,['customers.view'],id=>services.customers.findOne(id)],
    [/^\/api\/v1\/roles\/([^/]+)$/,['roles.view'],id=>services.roles.findOne(id)],
    [/^\/api\/v1\/production\/jobs\/([^/]+)$/,['production.view'],id=>services.jobs.findOne(id)],
    [/^\/api\/v1\/shipping\/ndr\/([^/]+)$/,['ndr.view'],id=>services.ndrRto.findNdrCase(id)],
    [/^\/api\/v1\/growth\/segments\/([^/]+)$/,['segments.view'],id=>services.customerSegments.findOne(id)],
    [/^\/api\/v1\/customization\/artwork\/([^/]+)$/,['artwork.view'],id=>prisma.artwork.findUniqueOrThrow({where:{id},include:{designVersion:true}})],
  ];
  for (const [pattern,permissions,load] of routes) {const match=pathname.match(pattern);if(match)return {permissions,load:()=>load(match[1])};}
  return null;
}
