import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async signUp(authCredentialDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
      });

      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username Already Exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentialDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'Success';
    } else {
      throw new UnauthorizedException('Please Check Your Login Credentials');
    }
  }
}
