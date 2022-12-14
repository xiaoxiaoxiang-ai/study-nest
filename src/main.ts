import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './execption.filter';
import { LoggingInterceptor, TransformInterceptor } from './interceptors/index';
import * as express from 'express';
import { join } from 'path';
async function bootstrap() {
  const rootDir = join(__dirname, '..');
  const app = await NestFactory.create(AppModule);
  app.use('/assets/images', express.static(join(rootDir, 'assets', 'images')));
  app.use('/assets/videos', express.static(join(rootDir, 'assets', 'videos')));
  app.use('/assets/files', express.static(join(rootDir, 'assets', 'files')));
  app.enableCors({
    origin: [/http:\/\/localhost/],
    methods: ['get', 'post'],
  });
  app.setGlobalPrefix(''); //设置全局的路由基路径
  app.useGlobalFilters(new AllExceptionFilter()); // 全局使用AllExceptionFilter处理错误
  app.useGlobalInterceptors(
    new LoggingInterceptor(new Reflector()),
    new TransformInterceptor(new Reflector()),
  ); // 注册全局拦截器
  // 添加全局中间件
  // app.use((req, res, next) => {
  //   console.log('全局中间件exec');
  //   next();
  // });
  const config = new DocumentBuilder()
    .setTitle('我的nest处女作')
    .setDescription('swagger初体验')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
}
bootstrap();
