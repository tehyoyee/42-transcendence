import { AuthModule } from "src/auth/auth.module";
import { GameGateway } from "./game.gateway";
import { Module } from '@nestjs/common';
import { UserModule } from "src/user/user.module";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";
import { MailService } from "src/auth/mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HttpModule } from "@nestjs/axios";
import { UserRepository } from "src/user/user.repository";

@Module({
	imports: [
		AuthModule,
		UserModule,
		MailerModule,
		HttpModule,
	],
	providers: [GameGateway, AuthService, UserService, MailService, UserRepository],
})
export class GameModule {}