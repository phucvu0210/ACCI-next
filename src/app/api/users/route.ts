// @ts-nocheck
import prisma from "@/lib/prisma";
import { createResponse } from "@/lib/response";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { _model, _method, _id, _relation, _where, ... fields } = data;
    
    const includeObject = _relation
      ? _relation.reduce((acc: Record<string, boolean>, relation: string) => {
        acc[relation] = true;
        return acc;
      }, {})
      : {};
    
    let result;
    switch (_method) {
      case "GET":
        result = await prisma[_model].findMany({
          include: includeObject,
          where: _where,
        });
        break;
      
      case "POST":
        result = await prisma[_model].create({
          data: fields,
          include: includeObject,
        });
        break;
      
      case "PUT":
        if (!_id) {
          throw new Error("ID is required for updating.");
        }
        
        result = await prisma[_model].update({
          where: { id: _id },
          data: fields,
          include: includeObject,
        });
        break;
      
      case "DELETE":
        if (!_id) {
          throw new Error("ID is required for deleting.");
        }
        
        result = await prisma[_model].delete({
          where: { id: _id },
        });
        break;
      
      default:
        throw new Error(`Unknown method: ${ _method }`);
    }
    
    return createResponse(true, result);
  } catch (error) {
    return createResponse(false, error?.message || 'fail');
  }
}
