import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RafflesModule } from './raffles/raffles.module';
import { TicketsModule } from './tickets/tickets.module';
import { DrawsModule } from './draws/draws.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      // Railway fornece DATABASE_URL direto — usa ela se disponível
      process.env.DATABASE_URL
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            ssl: { rejectUnauthorized: false },
          }
        : {
            type: 'postgres',
            host: process.env.DATABASE_HOST ?? 'localhost',
            port: parseInt(process.env.DATABASE_PORT ?? '5432'),
            username: process.env.DATABASE_USER ?? 'probbet',
            password: process.env.DATABASE_PASSWORD ?? 'probbet123',
            database: process.env.DATABASE_NAME ?? 'probbet_db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
          },
    ),
    AuthModule,
    UsersModule,
    RafflesModule,
    TicketsModule,
    DrawsModule,
    StatsModule,
  ],
})
export class AppModule {}
