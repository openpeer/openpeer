const DisputeNotes = () => {
	return (
		<div className="w-full mt-16 md:mt-0 md:w-1/2 md:border-l-2 md:border-gray-200 md:pl-8">
			<h3 className="text-xl pb-4">Points to note about Disputing Trade</h3>
			<ol className="list-decimal text-gray-500 pl-4 space-y-4">
				<li>Kindly state the reason you’re requesting for this dispute.</li>
				<li>Upload proof of transaction.</li>
				<li>Comment and proof will be sent to both parties of the transaction.</li>
				<li>Note that deceitful and baseless claim can result to permanent banning of your account.</li>
				<li>
					When disputing the transaction each party will have to pay a small dispute fee of 1% of the
					transaction, up to a maximum of $10 in USDT each.
				</li>
			</ol>
		</div>
	);
};
export default DisputeNotes;
