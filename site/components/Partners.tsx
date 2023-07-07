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
			<div className="w-full flex flex-col md:flex-row items-center gap-8 m-auto">
				<div className="grid grid-cols-3 gap-1 px-3 sm:grid-cols-4 md:px-0 lg:grid-cols-5 lg:gap-5">
					<div className="flex items-center justify-center rounded-md border border-white/20 p-2 hover:bg-gradient-to-r from-[#142228] via-[#142228] h-16">
						<Image src={outlierVentures} alt="Outlier Ventures" />
					</div>
					<div className="flex items-center justify-center rounded-md border border-white/20 p-2 hover:bg-gradient-to-r from-[#142228] via-[#142228] h-16">
						<Image src={polygonLogoWhite} alt="Polygon" />
					</div>
					<div className="flex items-center justify-center rounded-md border border-white/20 p-2 hover:bg-gradient-to-r from-[#142228] via-[#142228] h-16">
						<Image src={w3iLogoWhite} alt="Polygon" />
					</div>
					<div className="flex items-center justify-center rounded-md border border-white/20 p-2 hover:bg-gradient-to-r from-[#142228] via-[#142228] h-16">
						<Image src={bitfwdLogoWhite} alt="Polygon" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Partners;
