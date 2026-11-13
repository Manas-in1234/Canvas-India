-- Lets the admin reject a customer return request.
ALTER TYPE "ReturnStatus" ADD VALUE IF NOT EXISTS 'REJECTED';
