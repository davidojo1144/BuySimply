import { NestFactory } from '@nestjs/core';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { GlobalErrorFilter } from './common/filters/global-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(morgan('dev'));
  app.useGlobalFilters(new GlobalErrorFilter());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
