import {describe,it,expect,vi} from 'vitest';
import {resolveAdminRead} from './admin-read-routes.js';
describe('Admin Worker reads',()=>{
  it('resolves the board and permissions before treating their names as record IDs',async()=>{
    const board=vi.fn().mockResolvedValue({}),permissions=vi.fn().mockResolvedValue([]);
    const services={jobs:{board},roles:{listPermissions:permissions}} as any;
    const route=resolveAdminRead('/api/v1/production/jobs/board',{},services)!;
    expect(route.permissions).toEqual(['production.view']);expect(board).not.toHaveBeenCalled();await route.load();expect(board).toHaveBeenCalledOnce();
    const roles=resolveAdminRead('/api/v1/roles/permissions',{},services)!;expect(roles.permissions).toEqual(['roles.view']);await roles.load();expect(permissions).toHaveBeenCalledOnce();
  });
  it('requires both customer and order permission for a customer order history',()=>{
    const findMany=vi.fn();const route=resolveAdminRead('/api/v1/customers/customer-id/orders',{order:{findMany}},{} as any)!;
    expect(route.permissions).toEqual(['customers.view','orders.view']);expect(findMany).not.toHaveBeenCalled();
  });
  it('does not capture shape or ordinary existing Worker routes',()=>{
    for(const route of ['/api/v1/admin/shapes','/api/v1/shapes','/api/v1/orders','/api/v1/products'])expect(resolveAdminRead(route,{},{} as any)).toBeNull();
  });
  it('rejects an invalid artwork filter before querying',async()=>{
    const findMany=vi.fn();const route=resolveAdminRead('/api/v1/customization/artwork',{artwork:{findMany}},{} as any,'INVALID')!;
    expect(()=>route.load()).toThrow('Invalid artwork status');expect(findMany).not.toHaveBeenCalled();
  });
});
