import { IncomingMessage, ServerResponse } from "http";
import { parse } from 'url';
import { homeController } from './controllers/home.controller';
import { swaggerController } from './controllers/swagger.controller';
import { itemController } from './controllers/item.controller';
import { variantController } from './controllers/variant.controller';
import {auditController} from './controllers/audit.controller';

export async function router(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const { pathname} = parse(req.url || '');

    if(pathname === '/' || pathname === '') return homeController(req, res);
    if(pathname?.startsWith("/docs")) return swaggerController(req, res);
    if(pathname?.startsWith("/item")) return itemController(req, res);
    if(pathname?.startsWith("/variants")) return variantController(req, res);
    if(pathname?.startsWith("/audit-logs")) return await auditController(req, res);

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
}