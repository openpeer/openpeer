import React from 'react';
import Image from 'next/image';

import outlierVentures from '../public/partners/outlierventures.png';
import polygonLogoWhite from '../public/partners/polygonlogowhite.png';
import w3iLogoWhite from '../public/partners/w3ilogowhite.png';
import bitfwdLogoWhite from '../public/partners/bitfwdlogowhite.png';

const Partners = () => {
	return (
		<div className="flex flex-col text-center mb-24">
			<h3 className="text-4xl mb-12">Backers and Partners</h3>
			<div className="flex flex-col md:flex-row items-center gap-8 m-auto">
				<Image src={outlierVentures} alt="Outlier Ventures" />
				<Image src={polygonLogoWhite} alt="Polygon" />
				<Image src={w3iLogoWhite} alt="Polygon" />
				<Image src={bitfwdLogoWhite} alt="Polygon" />
			</div>
		</div>
	);
};

export default Partners;
