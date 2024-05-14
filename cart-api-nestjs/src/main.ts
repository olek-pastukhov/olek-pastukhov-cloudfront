import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { INestApplication } from '@nestjs/common';

let server: Handler;

async function createNestApp() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.init();
  return app;
}

function createServerlessExpress(app: INestApplication) {
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

async function bootstrap() {
  const app = await createNestApp();
  return createServerlessExpress(app);
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
