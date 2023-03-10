const Terms = () => {
	return (
		<>
			<h1>Privacy policy & terms</h1>
		</>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'Privacy Policy & Terms' } // will be passed to the page component as props
	};
}

export default Terms;
