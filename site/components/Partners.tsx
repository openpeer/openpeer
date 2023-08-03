import React from 'react';
import Image from 'next/image';

import outlierVentures from '../public/partners/outlierventures.png';
import polygonLogoWhite from '../public/partners/polygonlogowhite.png';
import w3iLogoWhite from '../public/partners/w3ilogowhite.png';
import bitfwdLogoWhite from '../public/partners/bitfwdlogowhite.png';
import ybbFoundationLtd from '../public/partners/ybbFoundation.png';

const Partners = () => {
	return (
		<div className="w-full flex justify-center items-center flex-col text-center mb-16 md:mb-40">
			<h3 className="text-5xl mb-12">Backers and Partners</h3>
			<div className="w-full flex flex-col justify-center items-center md:flex-row gap-8">
				<div className="grid grid-cols-3 gap-1 px-3 sm:grid-cols-4 md:px-0 lg:grid-cols-4 lg:gap-4">
					<div className="flex items-center justify-center rounded-md border border-white/20 p-2 hover:bg-gradient-to-r from-[#010AD4]/50 to-transparent h-16">
						<Image src={outlierVentures} alt="Outlier Ventures" />
					</div>
					<div className="flex items-center justify-center rounded-md border border-white/20 p-2 hover:bg-gradient-to-r from-[#010AD4]/50 to-transparent h-16">
						<Image src={polygonLogoWhite} alt="Polygon" />
					</div>
					<div className="flex items-center justify-center rounded-md border border-white/20 p-2 hover:bg-gradient-to-r from-[#010AD4]/50 to-transparent h-16">
						<Image src={w3iLogoWhite} alt="Polygon" />
					</div>
					<div className="flex items-center justify-center rounded-md border border-white/20 p-2 hover:bg-gradient-to-r from-[#010AD4]/50 to-transparent] h-16">
						<Image src={bitfwdLogoWhite} alt="Polygon" />
					</div>
					<div className="flex items-center justify-center rounded-md border border-white/20 p-2 hover:bg-gradient-to-r from-[#010AD4]/50 to-transparent] h-16">
						<Image src={ybbFoundationLtd} alt="YBB Foundation" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Partners;
