import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginDto } from "./dtos/login.dto";
import { MessagesHelper } from "./helper/messages.helper";


//Regra de negócio sempre no service
@Injectable()
export class AuthService{

    login(dto: LoginDto){
        if(dto.login !== 'teste@teste.com' || dto.password !== 'teste123'){
            throw new BadRequestException(MessagesHelper.AUTH_PASSWORD_OR_LOGIN_NOT_FOUND)
        }

        return dto;
    }
}