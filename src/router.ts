import { IncomingHttpHeaders, ServerResponse } from "http";
import { parse } from 'url';
import { swaggerController } from './controllers/swaggerController';
import { itemController } from './controllers/itemController';
import { variantController } from './controllers/variantController';
import {auditController} from './controllers/auditController';

export function router(req: IncomingMessage, res: ServerResponse) :void {
    const { pathname} = parse(req.url || '');

    if(pathname?.startsWith("/docs")) return swaggerController(req, res);
    if(pathname?.startsWith("/item")) return itemController(req, res);
    if(pathname?.startsWith("/variants")) return variantController(req, res);
    if(pathname?.startsWith("/audit-logs")) return auditController(req, res);

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
}