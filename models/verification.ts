export interface Verification {
	session_id: string;
	alias: string;
	status: 'PENDING' | 'VERIFIED' | 'CANCELLED';
}
