import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RegisterDto } from './dtos/register.dto'
import { User, UserDocument } from './schemas/user.schema';
import * as CryptoJS from 'crypto-js'

@Injectable() // Marca a classe como injetável para que o Nest.js possa injetar dependências nela
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>){} // Define o construtor da classe, injetando o modelo User do Mongoose

    async create(dto: RegisterDto){ // Define um método assíncrono chamado 'create' que recebe um objeto do tipo RegisterDto como parâmetro
        dto.password = CryptoJS.AES.encrypt(dto.password, process.env.USER_CYPHER_SECRET_KEY).toString(); // Criptografa a senha do usuário usando o algoritmo AES e a chave secreta fornecida no ambiente

        const createdUser = new this.userModel(dto); // Cria um novo objeto User usando o modelo do Mongoose e o DTO fornecido
        await createdUser.save(); // Salva o usuário criado no banco de dados
    }

    async existsByEmail(email: String): Promise<boolean>{ // Define um método assíncrono chamado 'existsByEmail' que verifica se um usuário com o email fornecido existe
        const result = await this.userModel.findOne({email}); // Procura por um usuário no banco de dados com o email fornecido

        if(result){ // Se o resultado da busca não for nulo (ou seja, se um usuário com o email fornecido foi encontrado)
            return true; // Retorna verdadeiro
        }

        return false; // Caso contrário, retorna falso
    }

    async getUserByLoginPassword(email: string, password: string): Promise<UserDocument | null>{ // Define um método assíncrono chamado 'getUserByLoginPassword' que retorna um usuário com base no email e senha fornecidos
        const user = await this.userModel.findOne({email}) as UserDocument; // Procura por um usuário no banco de dados com o email fornecido e converte o resultado para o tipo UserDocument

        if(user){ // Se um usuário com o email fornecido for encontrado
            const bytes = CryptoJS.AES.decrypt(user.password, process.env.USER_CYPHER_SECRET_KEY); // Decifra a senha do usuário usando o algoritmo AES e a chave secreta fornecida no ambiente
            const savedPassword = bytes.toString(CryptoJS.enc.Utf8); // Converte a senha decifrada para uma string UTF-8

            if(password == savedPassword){ // Se a senha fornecida for igual à senha salva no banco de dados
                return user; // Retorna o usuário
            }
        }

        return null; // Caso contrário, retorna nulo
    }

    async getUserById(id:string){ // Define um método assíncrono chamado 'getUserById' que retorna um usuário com base no ID fornecido
        return await this.userModel.findById(id); // Retorna um usuário do banco de dados com o ID fornecido
    }
}