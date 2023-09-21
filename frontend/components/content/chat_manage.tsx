import { useState } from 'react';
import styles from '@/styles/chat_manage.module.css';
import useSocketContext from '@/lib/socket';

enum Type {
	Public = 1,
	Private,
	Password,
};

export function ChatMenu() {
	const [type, setType] = useState<Type>(Type.Public);
//	const { chatSocket } = useSocketContext();

	function handleTypeChange(e: any) {
		switch (Number(e.target.value)) {
			case Type.Public:
				setType(Type.Public);
				break;
			case Type.Private:
				setType(Type.Private);
				break;
			case Type.Password:
				setType(Type.Password);
				break;
		}
	}

	function handleCreation() {
	}

	return (
		<div className={styles.chatMenu}>
			<form onSubmit={(e) => {e.preventDefault(); handleCreation}}>
				<label 
					htmlFor="nameField">채팅방 이름</label>
				<input 
					style={{
						margin: "6px",
						border: "solid 1px black",
					}}
					type="text"
					pattern="[a-zA-Z0-9]{2,16}"
					required
				/>
				<fieldset onChange={handleTypeChange}>
					<legend>채팅방 종류</legend>
					<div>
						<input type='radio' id='public' name='type' value={Type.Public}/>
						<label htmlFor='public'>Public</label>
					</div>

					<div>
						<input type='radio' id='private' name='type' value={Type.Private}/>
						<label htmlFor='private'>Private</label>
					</div>

					<div>
						<input type='radio' id='password' name='type' value={Type.Password}/>
						<label htmlFor='password'>With Password</label>
					</div>
				</fieldset>
				{
					(type == Type.Password) &&
					<>
						<label 
							htmlFor="nameField">비밀번호</label>
						<input 
							style={{
								margin: "6px",
								border: "solid 1px black",
								marginBottom: "16px", /* to align bottom button */
							}}
							type="text"
							pattern="[a-zA-Z0-9]{4,16}"
							required
						/>
					</> ||
					<>
					{/*to align bottom button*/}
						<br />
						<br />
					</>
				}
				<button
					style={{
						position: "relative",
						top: "200px",
						padding: "2px",
						border: "solid 1px black",
						backgroundColor: "lightgray",
						borderRadius: "0.3rem",
					}}
					>생성하기</button>
			</form>
		</div>
	);
}
/*
 * options for chat room creation
 *
 * 1. public, private or password
 * 1-2. if password, get password
 * 1-3. if private, ?
 * 2. room name
 * 2-1. if name is duplicate, prompt retry
 *
 */