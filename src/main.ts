import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { ResponseInterceptor } from './configs/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './configs/decorators/catchError';
import CustomLogger from './modules/log/customLogger';
import getLogLevels from './utils/getLogLevels';

// Store the app instance for Vercel
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, {
      logger: getLogLevels(process.env.NODE_ENV === 'production'),
      bufferLogs: true,
    });

    app.useLogger(app.get(CustomLogger));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');

    const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
    app.enableCors({
      origin: corsOrigin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
      new ResponseInterceptor(),
    );

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    const swaggerConfig = new DocumentBuilder()
      .setTitle('API with NestJS')
      .setDescription('API developed throughout the API with NestJS course')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/v1/api', app, document);

    // Initialise the app but don't call .listen() yet
    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// Export the default function for Vercel
export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};

// Logic to run local vs serverless
if (process.env.NODE_ENV !== 'production') {
  // LOCAL: Start listening on port
  bootstrap().then(async (app) => {
    const port = process.env.PORT || 3000;
    await app.listen(port);
  });
}
