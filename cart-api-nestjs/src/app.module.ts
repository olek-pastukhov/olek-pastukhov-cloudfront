import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";

import { CartModule } from "./cart/cart.module";
import { AuthModule } from "./auth/auth.module";
import { OrderModule } from "./order/order.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeoutMS: 5000,
      synchronize: true
    }),
    AuthModule,
    CartModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {
}
