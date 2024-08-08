export interface TelegramUser {
	id: number;
	first_name: string;
	username?: string;
	photo_url?: string;
	auth_date: number;
	hash: string;
}
