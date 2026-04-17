import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class GlobalErrorFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
