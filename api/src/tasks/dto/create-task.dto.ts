import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';


export class CreateTaskDto {
@IsString()
@MaxLength(120)
title: string;


@IsOptional()
@IsString()
description?: string;


@IsOptional()
@IsString()
category?: string; // Work|Personal etc


@IsOptional()
@IsIn(['Backlog', 'Open', 'Done'])
status?: 'Backlog' | 'Open' | 'Done';
}