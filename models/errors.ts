// models/errors.ts
export const ERROR_FIELDS = {
	name: 'name',
	email: 'email',
	twitter: 'twitter',
	whatsapp_country_code: 'whatsapp_country_code',
	whatsapp_number: 'whatsapp_number',
	telegram_user_id: 'telegram_user_id',
	telegram_username: 'telegram_username',
	general: 'general'
} as const;

export type ErrorFields = keyof typeof ERROR_FIELDS;

export type Errors = {
	[key in ErrorFields]?: string;
} & {
	[key: string]: string | undefined;
};

export type Resolver = () => Errors;
