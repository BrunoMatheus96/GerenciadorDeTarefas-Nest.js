//Aqui que vai mapear e guardar a nossa estrutura de tabela com o nosso objeto do Nest. Seria o Middleware no Next.js

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; 
import { HydratedDocument } from 'mongoose'; 
export type UserDocument = HydratedDocument<User>; 

@Schema() 
export class User { 
 @Prop({required: true}) //require: true informa que é obrogatório
 name: string; 

 @Prop({required: true}) 
 email: string; 

 @Prop({required: true}) 
 password: string;
} 

export const UserSchema = SchemaFactory.createForClass(User);