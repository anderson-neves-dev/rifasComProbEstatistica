import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string; user: Partial<User> }> {
    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingUser) throw new ConflictException('E-mail já cadastrado');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      points: 100, // Todo usuário começa com 100 pontos
    });

    const savedUser = await this.userRepository.save(user);
    const accessToken = this.jwtService.sign({ sub: savedUser.id, email: savedUser.email });

    return {
      accessToken,
      user: { id: savedUser.id, name: savedUser.name, email: savedUser.email, points: savedUser.points },
    };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: Partial<User> }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'name', 'email', 'password', 'points', 'createdAt'],
    });

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('Credenciais inválidas');

    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, points: user.points },
    };
  }
}
