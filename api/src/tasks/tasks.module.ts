import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { OrgsModule } from '../orgs/orgs.module';


@Module({
imports: [TypeOrmModule.forFeature([Task]), OrgsModule],
providers: [TasksService],
controllers: [TasksController],
})
export class TasksModule {}