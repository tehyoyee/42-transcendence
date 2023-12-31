import { DataSource, Not, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import {
  OnApplicationBootstrap,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { UserStatus } from './enum/user-status.enum';
import { UserAchievement } from './enum/user-achievements.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { verify } from 'crypto';
import { GameHistory } from 'src/game/game.history.entity';

@Injectable()
export class UserRepository extends Repository<User> implements OnApplicationBootstrap {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async onApplicationBootstrap() {
    await this.createQueryBuilder()
    .update(User)
    .set({ status: UserStatus.OFFLINE })
    .where({})
    .execute();
  }
  
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.create({
      user_id: createUserDto.user_id,
      username: createUserDto.username,
      nickname: createUserDto.nickname,
      email: createUserDto.email,
      avatar: createUserDto.avatar,
    });
    await this.save(newUser);

    return newUser;
  }

  async getMyProfile(id: number): Promise<User> {
    const currentUser = await this.getProfileByUserId(id);
    if (!currentUser) throw new NotFoundException(`유저 ${id}는 없습니다.`);

    return currentUser;
  }

  async getProfileByUserName(username: string): Promise<User> {
    const found = await this.findOne({
      where: { username: username },
    });

    return found;
  }

  async getProfileByUserId(id: number): Promise<User> {
    const found = await this.findOne({
      where: { user_id: id },
    });

    return found;
  }

  async getProfileByNickName(nickname: string): Promise<User> {
    const found = await this.findOne({
      where: { nickname: nickname },
    });

    return found;
  }

  async getTwoFactorByUserId(id: number): Promise<boolean> {
    const found = await this.findOne({
      where: { user_id: id },
    });
    return found.two_factor;
  }

  async getEmailByUserId(id: number): Promise<string> {
    const found = await this.findOne({
      where: { user_id: id },
    });
    return found.email;
  }

  async updateTwoFactor(user: User, newTwoFactor: boolean): Promise<void> {
    user.two_factor = newTwoFactor;
    await this.save(user);
  }

  async getAvatarByUserId(id: number): Promise<string> {
    const found = await this.findOne({
      where: { user_id: id },
    });
    return found.avatar;
  }

  async updateAvatar(user: User, newAvatar: string): Promise<void> {
    user.avatar = newAvatar;
    await this.save(user);
  }

  async updateNickName(user: User, newNickname: string): Promise<void> {
    user.nickname = newNickname;
    await this.save(user);
  }

  async updateStatus(id: number, newStatus: UserStatus): Promise<User> {
    const found = await this.getProfileByUserId(id);
    if (!found) throw new HttpException('Unexist UserId', HttpStatus.NOT_FOUND);

    found.status = newStatus;
    return await this.save(found);
  }

  async updateAchievement(
    id: number,
    newAchievement: UserAchievement,
  ): Promise<User> {
    const found = await this.getProfileByUserId(id);
    if (!found) throw new HttpException('Unexist UserId', HttpStatus.NOT_FOUND);

    found.achievement = newAchievement;
    return await this.save(found);
  }

  async getGameHistoryByUserId(id: number) {
    const found = await this.getProfileByUserId(id);
    if (!found) throw new HttpException('Unexist UserId', HttpStatus.NOT_FOUND);
    return found.gameHistories;
  }

  async getCurrentUserStatusByUserId(userId: number): Promise<UserStatus> {
    const found = await this.getProfileByUserId(userId);

    return found.status;
  }

  async updateGameHistory(id: number, gameHistory: GameHistory) {
    const found = await this.getProfileByUserId(id);
    if (!found) throw new HttpException('Unexist UserId', HttpStatus.NOT_FOUND);
    found.gameHistories.push(gameHistory);
    this.save(found);
  }

  async updateGamePoint(id: number, value: number): Promise<void> {
    const found = await this.getProfileByUserId(id);
    if (!found) throw new HttpException('Unexist UserId', HttpStatus.NOT_FOUND);
    found.point += value;
    await this.save(found);
  }

  async winGame(id: number): Promise<User> {
    const found = await this.getProfileByUserId(id);
    if (!found) throw new HttpException('Unexist UserId', HttpStatus.NOT_FOUND);

    found.win_count++;
    return await this.save(found);
  }

  async loseGame(id: number): Promise<User> {
    const found = await this.getProfileByUserId(id);
    if (!found) throw new HttpException('Unexist UserId', HttpStatus.NOT_FOUND);

    found.lose_count++;
    return await this.save(found);
  }

  async updateAuthCodeByUserId(id: number, authCode: string): Promise<void> {
    const found = await this.getProfileByUserId(id);
    if (!found) throw new HttpException('Unexist UserId', HttpStatus.NOT_FOUND);
    found.auth_code = authCode;
    return;
  }

  async getAuthCodeByUserId(id: number): Promise<string> {
    const found = await this.getProfileByUserId(id);
    if (!found) throw new HttpException('Unexist UserId', HttpStatus.NOT_FOUND);
    return found.auth_code;
  }

  async updateTwoFactorCode(id: number, newCode: string): Promise<void> {
    const found = await this.getProfileByUserId(id);
    if (!found) throw new HttpException('Unexist UserId', HttpStatus.NOT_FOUND);
    found.auth_code = newCode;
    await this.save(found);
    return;
  }
}
