import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RelationRepository } from './relation.repository';
import { User } from 'src/user/entity/user.entity';
import { Relation } from './entity/relation.entity';
import { RelationType } from './enum/relation-type.enum';
import { SocialDto } from './dto/social-dto';
import { UserService } from 'src/user/user.service';
import { BlockDto, FriendDto } from './dto/relation-dto';

@Injectable()
export class RelationService {
  constructor(
    private userService: UserService,
    private relationRepository: RelationRepository,
  ) {}

  private logger = new Logger('RelationService');

  async addFriend(sender: User, receiverId: number): Promise<Relation> {
    if (sender.user_id === receiverId) {
      throw new HttpException('Cannot Set To Yourself', HttpStatus.CONFLICT);
    }

    //이미 sender가 receiver를 친구로 등록했는지 검사
    if (await this.checkFriended(sender.user_id, receiverId)) {
      throw new HttpException('Friended Already', HttpStatus.CONFLICT);
    }

    //이미 sender가 receiver를 block했는지 검사 -> 바꿔는 줌
    if (await this.checkBlocked(sender.user_id, receiverId)) {
      await this.unBlock(sender.user_id, receiverId);
      this.logger.debug('Block To Friend');
    }

    return await this.relationRepository.addRelation(
      sender,
      receiverId,
      RelationType.FRIEND,
    );
  }

  async addBlock(sender: User, receiverId: number): Promise<Relation> {
    if (sender.user_id === receiverId) {
      throw new HttpException('Cannot Set To Yourself', HttpStatus.CONFLICT);
    }

    //이미 sender가 receiver를 block했는지 검사
    if (await this.checkBlocked(sender.user_id, receiverId)) {
      throw new HttpException('Blocked Already', HttpStatus.CONFLICT);
    }

    //이미 sender가 receiver를 친구등록 했는지 검사 -> 바꿔는 줌
    if (await this.checkFriended(sender.user_id, receiverId)) {
      await this.unFriend(sender.user_id, receiverId);
      this.logger.debug('Friend To Block');
    }

    return await this.relationRepository.addRelation(
      sender,
      receiverId,
      RelationType.BLOCK,
    );
  }

  async unFriend(senderId: number, receiverId: number) {
    const relation = await this.getRelationByIds(senderId, receiverId);
    if (
      !relation ||
      (relation && relation.relation_type !== RelationType.FRIEND)
    ) {
      throw new HttpException('Not Friended Before', HttpStatus.CONFLICT);
    }

    await this.relationRepository.deleteRelation(relation.relation_id);
  }

  async unBlock(senderId: number, receiverId: number) {
    const relation = await this.getRelationByIds(senderId, receiverId);
    if (
      !relation ||
      (relation && relation.relation_type !== RelationType.BLOCK)
    ) {
      throw new HttpException('Not Blocked Before', HttpStatus.CONFLICT);
    }

    await this.relationRepository.deleteRelation(relation.relation_id);
  }

  async getRelationByIds(
    senderId: number,
    receiverId: number,
  ): Promise<Relation> {
    return await this.relationRepository.getRelationByIds(senderId, receiverId);
  }

  async checkFriended(senderId: number, receiverId: number) {
    const friended = await this.getRelationByIds(senderId, receiverId);
    if (friended && friended.relation_type === RelationType.FRIEND) {
      return true;
    }

    return false;
  }

  async checkBlocked(senderId: number, receiverId: number) {
    const blocked = await this.getRelationByIds(senderId, receiverId);
    if (blocked && blocked.relation_type === RelationType.BLOCK) {
      return true;
    }

    return false;
  }

  async getFriendsOfUser(userId: number): Promise<SocialDto[]> {
    const friends: SocialDto[] = [];
    const relationType = RelationType.FRIEND;

    const relations = await this.relationRepository
      .createQueryBuilder('r')
      .where('r.sender_id = :userId', { userId })
      .andWhere('r.relation_type = :relationType', { relationType })
      .select(['r.receiver_id'])
      .getMany();

    for (const r of relations) {
      const user = await this.userService.getProfileByUserId(r.receiver_id);
      const currentStatus = await this.userService.getCurrentUserStatusByUserId(
        r.receiver_id,
      );
      friends.push({
        userId: user.user_id,
        userNickName: user.nickname,
        isFriend: true,
        isBlocked: false,
        userStatus: currentStatus,
      });
    }

    return friends;
  }

  async getBlocksOfUser(userId: number): Promise<SocialDto[]> {
    const blocks: SocialDto[] = [];
    const relationType = RelationType.BLOCK;

    const relations = await this.relationRepository
      .createQueryBuilder('r')
      .where('r.sender_id = :userId', { userId })
      .andWhere('r.relation_type = :relationType', { relationType })
      .select(['r.receiver_id'])
      .getMany();

    for (const r of relations) {
      const user = await this.userService.getProfileByUserId(r.receiver_id);
      const currentStatus = await this.userService.getCurrentUserStatusByUserId(
        r.receiver_id,
      );
      blocks.push({
        userId: user.user_id,
        userNickName: user.nickname,
        isFriend: false,
        isBlocked: true,
        userStatus: currentStatus,
      });
    }

    return blocks;
  }

  async getEveryoneWhoBlockedMe(myId: number): Promise<BlockDto[]> {
    const whoBlockedMe: BlockDto[] = [];
    const relationType = RelationType.BLOCK;

    const relations = await this.relationRepository
      .createQueryBuilder('r')
      .where('r.receiver_id = :myId', { myId })
      .andWhere('r.relation_type = :relationType', { relationType })
      .select(['r.sender_id'])
      .getMany();

    for (const r of relations) {
      const b_id = { userId: r.sender_id };
      whoBlockedMe.push(b_id);
    }

    return whoBlockedMe;
  }

  async getEveryoneWhoFriendedMe(myId: number): Promise<FriendDto[]> {
    const whoFriendedMe: FriendDto[] = [];
    const relationType = RelationType.FRIEND;

    const relations = await this.relationRepository
      .createQueryBuilder('r')
      .where('r.receiver_id = :myId', { myId })
      .andWhere('r.relation_type = :relationType', { relationType })
      .select(['r.sender_id'])
      .getMany();

    for (const r of relations) {
      const f_id = { userId: r.sender_id };
      whoFriendedMe.push(f_id);
    }

    return whoFriendedMe;
  }
}
