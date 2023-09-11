export interface CancelReasons {
	[key: string]: string;
}

export const cancelReasons: CancelReasons = {
	tookTooLong: 'Trade took too long to complete',
	hasntCompletedNextSteps: "Other trader hasn't completed next steps",
	dontWantToTrade: "Don't want to trade with other trader",
	dontUnderstand: "Don't understand OpenPeer",
	other: 'Other'
};
