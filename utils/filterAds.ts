// utils/filterAds.ts
import { List, User } from 'models/types';

interface UserRelationships {
	blocked_users: User[];
	blocked_by_users: User[];
	trusted_users: User[];
	trusted_by_users: User[];
}

const filterAdsByUserRelationships = (
	ads: List[],
	userRelationships: UserRelationships,
	address: string | undefined
) => {
	const blockedUserIds = new Set<number>([
		...userRelationships.blocked_users.map((user) => Number(user.id)),
		...userRelationships.blocked_by_users.map((user) => Number(user.id))
	]);

	// const trustedUsers = userRelationships.trusted_users;
	const trustedByUsers = userRelationships.trusted_by_users;

	return ads.filter((list) => {
		const isTrustedOnly = list.accept_only_trusted;
		const sellerId = Number(list.seller?.id);

		if (!sellerId) {
			console.log(`Excluding list ${list.id} because seller ID is missing or invalid`);
			return false;
		}

		// const sellerTrustedByMe = trustedUsers.some((user) => Number(user.id) === sellerId);
		const sellerTrustsMe = trustedByUsers.some((user) => Number(user.id) === sellerId);

		const isSellerBlocked = blockedUserIds.has(sellerId);
		const cannotAccessTrustedOnlyAd = isTrustedOnly && (!address || !sellerTrustsMe);

		if (isSellerBlocked) {
			console.log(`Excluding list ${list.id} because seller ${sellerId} is blocked`);
			return false;
		}

		if (cannotAccessTrustedOnlyAd) {
			console.log(
				`Excluding list ${list.id} because it's trusted-only and seller ${sellerId} is neither trusted by you nor trusts you`
			);
			return false;
		}

		return true;
	});
};

export default filterAdsByUserRelationships;
