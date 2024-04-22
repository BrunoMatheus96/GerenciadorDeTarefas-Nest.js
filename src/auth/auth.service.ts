import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { LoginDto } from "./dtos/login.dto";
import { MessagesHelper } from "./helper/messages.helper";
import { RegisterDto } from "src/user/dtos/register.dto";
import { UserService } from "src/user/user.service";
import { UserMessagesHelper } from "src/user/helpers/messages.helper";


//Regra de negócio sempre no service
@Injectable()
export class AuthService{
    private logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        ){}

    login(dto: LoginDto){
        this.logger.debug('Login - started')
        if(dto.login !== 'teste@teste.com' || dto.password !== 'teste123'){
            throw new BadRequestException(MessagesHelper.AUTH_PASSWORD_OR_LOGIN_NOT_FOUND)
        }

        return dto;
    }

    async register (dto: RegisterDto){
        this.logger.debug('Register - started');
        if(await this.userService.existsByEmail(dto.email)){
            throw new BadRequestException(UserMessagesHelper.REGISTER_EXIST_EMAIL_ACCOUNT);
        }

        await this.userService.create(dto);
    }
}