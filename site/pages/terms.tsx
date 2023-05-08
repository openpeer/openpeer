import { useState } from 'react';

export default function TermsPage() {
	const [navbar, setNavbar] = useState(false);
	return (
		<>
			<div className="container mx-auto py-16 px-4 w-full md:w-1/2">
				<h2 className="text-2xl font-bold py-4">TERMS OF SERVICE AGREEMENT</h2>
				<span className="text-gray-400"> Last Modified: 13 April 2023 </span>

				<p className="mt-16 mb-4">
					Welcome to openpeer.xyz, a website-hosted user interface (the "Interface" or "App") provided by
					OpenPeer Protocol ("we", "our", or "us"). The Interface provides access to a decentralised self
					custody peer to peer protocol on the Ethereum blockchain which allows users to trade crypto and fiat
					between each other through interaction with the OpenPeer Protocol smart contract infrastructure and
					web interface (the “OpenPeer Protocol" or "Protocol" or “Platform”). The Interface is one, but not
					the exclusive, means of accessing the Protocol. To use the Protocol, you must use non-custodial
					wallet software, which allows you to interact with public blockchains. Your relationship with that
					non-custodial wallet is governed by the applicable terms of service of that third party, not this
					Terms of Service Agreement (the "<span className="font-bold">Agreement</span>").
				</p>
				<p className="mb-4">
					OpenPeer Protocol will operate as a purely decentralised autonomous organisation governed by $P2P
					token holders pursuant to a delineated governance structure (the “OpenPeer Protocol DAO”, or the
					“Organisation”); providing oversight, maintenance and upgrade of the OpenPeer Protocol through the
					mechanisms of decentralised governance which may include but is not limited to and pending
					governance approval, creation of action groups with specific technical knowledge to handle system
					parameters and creation of other action groups to facilitate other functions and aspects of the
					Protocol. Such functions of decentralised governance will continue to govern all other facets of the
					Protocol and Organisation on a continuing basis and democratised governance will be unlimited in
					scope in relation to all functions related to the Protocol and Organisation.
				</p>
				<p className="mb-4">
					This Terms of Service Agreement (the "Agreement") explains the terms and conditions by which you may
					access and use the Interface. You must read this Agreement carefully. By accessing or using the
					Interface, you signify that you have read, understand, and agree to be bound by this Agreement in
					its entirety. If you do not agree, you are not authorized to access or use the Interface and should
					not use the Interface.
				</p>

				<div className="flex flex-col justify-center font-bold text-center py-8">
					<p className="mb-4">
						NOTICE: PLEASE READ THIS AGREEMENT CAREFULLY AS IT GOVERNS YOUR USE OF THE INTERFACE. THIS
						AGREEMENT CONTAINS IMPORTANT INFORMATION, INCLUDING A BINDING ARBITRATION PROVISION AND A
						className ACTION WAIVER, BOTH OF WHICH IMPACT YOUR RIGHTS AS TO HOW DISPUTES ARE RESOLVED. THE
						INTERFACE IS ONLY AVAILABLE TO YOU - AND YOU SHOULD ONLY ACCESS THE INTERFACE - IF YOU AGREE
						COMPLETELY WITH THESE TERMS.
					</p>
					<p className="mb-4">
						BY CONNECTING YOUR WALLET AND UTILISING THE OPENPEER PROTOCOL PLATFORM, YOU AGREE TO ACCEPT ALL
						THE TERMS AND CONDITIONS SET OUT IN THIS AGREEMENT.
					</p>
					<p className="mb-4">
						FURTHER TERMS APPLY TO USERS WHO CREATE AN OPENPEER ACCOUNT. THOSE TERMS ARE APPENDED TO THIS
						AGREEMENT AS APPENDIX 2
					</p>
				</div>

				<h3 className="mt-8 text-lg font-bold mb-4">Modification of this Agreement</h3>
				<p className="mb-4">
					We reserve the right, in our sole discretion, to modify this Agreement from time to time. If we make
					any modifications, we will notify you by reuploading a current version of the Agreement at:
					https://docs.google.com/document/d/e/2PACX-1vTbrZiFIdODPBupwSGhtn-gOcOkNxdoXhtQHJfZzSkhVSPPCRCQmMHo1CRtJuf_7eoC8q4iyLXtAmyO/pub.
				</p>

				<p className="mb-4">
					All modifications will be effective when they are posted, and your continued accessing or use of the
					Interface will serve as confirmation of your acceptance of those modifications. If you do not agree
					with any modifications to this Agreement, you must immediately stop accessing and using the
					Interface.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Eligibility</h3>
				<p className="mb-4">
					o access or use the Interface, you must be able to form a legally binding contract with us.
					Accordingly, you represent that you are at least the age of majority in your jurisdiction (e.g.
					eighteen years old) and have the full right, power, capacity and authority to enter into and comply
					with the terms and conditions of this Agreement on behalf of yourself and any company or legal
					entity for which you may access or use the Interface.
				</p>
				<p className="mb-4">
					Our Interface is <b>NOT</b> offered to persons or entities who reside in, are citizens of, are
					incorporated in, or have a registered office in the United States of America or any Prohibited
					Localities, as defined below (any such person or entity, a “Restricted Person”). We do not make
					exceptions. If you are a restricted person, then do not attempt to access or use the Interface. Use
					of a virtual private network (e.g. a VPN) or other means by Restricted Persons to access or use the
					Interface is strictly <b>prohibited</b>.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">General.</h3>
				<p className="mb-4">
					You may not use the Interface if you are otherwise barred from using the Interface under applicable
					law.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Legality.</h3>
				<p className="mb-4">
					You are solely responsible for adhering to all laws and regulations applicable to you and your use
					or access to the Interface. Your use of the Interface is prohibited by and will not otherwise
					violate or facilitate the violation of any applicable laws or regulations, or contribute to or
					facilitate any illegal activity. Such requirement of legal adherence includes but is not limited to
					your sole responsibility for reporting and paying any taxes applicable to your use of the Interface.
				</p>
				<p className="mb-4">
					By using or accessing the Interface, you represent to us that you are not subject to sanctions or
					otherwise designated on any list of prohibited or restricted parties or excluded or denied persons,
					including but not limited to the lists maintained by the United Nations Security Council, the
					European Union or its Member States, or any other relevant government authority.
				</p>
				<p className="mb-4">
					We make no representations or warranties that the information, products, or services provided
					through our Interface, are appropriate for access or use in other jurisdictions and as such you make
					representations that your access of the Protocol within your respective jurisdiction is lawful and
					that you have taken reasonable steps to ascertain the appropriate limitations and general
					restrictions, if any, as pertains to your respective jurisdiction. You are not permitted to access
					or use our Interface in any jurisdiction or country if it would be contrary to the law or regulation
					of that jurisdiction or if it would subject us to the laws of, or any registration requirement with,
					such jurisdiction. We reserve the right to limit the availability of our Interface to any person,
					geographic area, or jurisdiction, at any time and at our sole and absolute discretion
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Prohibited Localities.</h3>
				<p className="mb-4">
					OpenPeer Protocol does not interact with digital wallets located in, established in, or a resident
					of Panama, Myanmar (Burma), Cote D'Ivoire (Ivory Coast), Cuba, Crimea and Sevastopol, Democratic
					Republic of Congo, Iran, Iraq, Libya, Mali, Nicaragua, Democratic People’s Republic of Korea (North
					Korea), Somalia, Sudan, Syria, Yemen, Zimbabwe, the Russian Federation or any other state, country
					or region that is subject to sanctions enforced by the United States, the United Kingdom or the
					European Union.
				</p>
				<p className="mb-4">
					You must not use any software or networking techniques, including use of a Virtual Private Network
					(VPN) to modify your internet protocol address or otherwise circumvent or attempt to circumvent this
					prohibition.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Non-Circumvention.</h3>
				<p className="mb-4">
					You agree not to access the Interface using any technology for the purposes of circumventing these
					Terms.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Access to the Interface</h3>
				<p className="mb-4">
					We reserve the right to disable access to the Interface at any time in the event of any breach of
					the Terms, including without limitation, if we, in our sole discretion, believe that you, at any
					time, fail to satisfy the eligibility requirements set forth in the Terms. Further, we reserve the
					right to limit or restrict access to the Interface by any person or entity, or within any geographic
					area or legal jurisdiction, at any time and at our sole discretion. We will not be liable to you for
					any losses or damages you may suffer as a result of or in connection with the Interface being
					inaccessible to you at any time or for any reason.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Proprietary Rights</h3>
				<p className="mb-4">
					We the Organisation, via an assigned signatory body of OpenPeer Protocol, or another assigned
					signatory body of the OpenPeer Protocol DAO as determined from time-to-time, own all intellectual
					property and other rights in the Interface and its contents, including, but not limited to,
					software, text, images, trademarks, service marks, copyrights, patents, and designs. Unless
					expressly authorized by us, you may not copy, modify, adapt, rent, license, sell, publish,
					distribute, or otherwise permit any third party to access or use the Interface or any of its
					contents. Accessing or using the Interface does not constitute a grant to you of any proprietary
					intellectual property or other rights in the Interface or its contents. The open source software
					associated with the Protocol may be subject to certain business licenses which you are aware of and
					which may impose significant restrictions on any attempts to fork, whether in whole or in part, the
					protocol, within the parameters of the license. You understand and acknowledge that an attempt to
					subvert, avoid or any other such act which diminish such licenses as they appear from time-to-time
					within the open source documentation may be remedied via an injunction against you or further
					addressed via any other method permitted by law.
				</p>
				<p className="mb-4">
					materials you submit through the Interface. However, by uploading such information or materials, you
					grant us a worldwide, royalty-free and irrevocable licence to use, copy, distribute, publish and
					send this data in any manner in accordance with applicable laws and regulations subject to the
					OpenPeer Privacy Policy.
				</p>
				<p className="mb-4">
					You may choose to submit comments, bug reports, ideas or other feedback about the Interface,
					including, without limitation, about how to improve the Interface (collectively, “Feedback”). By
					submitting any Feedback, you agree that we are free to use such Feedback at our discretion and
					without additional compensation to you, and to disclose such Feedback to third parties (whether on a
					nonconfidential basis or otherwise). If necessary under applicable law, then you hereby grant us a
					perpetual, irrevocable, non-exclusive, transferable, worldwide licence under all rights necessary
					for us to incorporate and use your Feedback for any purpose.
				</p>
				<p className="mb-4">
					If (i) you satisfy all of the eligibility requirements set forth in the Terms, and (ii) your access
					to and use of the Interface complies with the Terms, you hereby are granted a single, personal,
					limited licence to access and use the Interface. This licence is non-exclusive, non-transferable,
					and freely revocable by us at any time without notice or cause in our sole discretion. Use of the
					Interface for any purpose not expressly permitted by the Terms is strictly prohibited. Unlike the
					Interface, the Protocol is composed entirely of open-source software running on the public Ethereum
					Blockchain and other blockchains and is not our proprietary property, subject to varying licences,
					if any, that may exist corresponding to the open source documentation, code or repository enforced
					and placed by us. Pursuant to the foregoing and notwithstanding the open-source nature of the
					protocol, we reserve the right to apply licensing to the software as appropriate from time-to-time
					in our sole and absolute discretion. If you have contributed to the open source protocol, whether in
					a trivial or significant fashion, you consent to any and all relicensing of the project. The
					Protocol may also run on the other blockchains to which the same clause applies.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Additional Rights</h3>
				<p className="mb-4">
					We reserve the following rights, which do not constitute obligations of ours: (a) with or without
					notice to you, to modify, substitute, eliminate or add to the Interface; (b) to review, modify,
					filter, disable, delete and remove any and all content and information from the Interface; and (c)
					to cooperate with any law enforcement, court or government investigation or order or third party
					requesting or directing that we disclose information or content or information that you provide.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Privacy</h3>
				<p className="mb-4">
					When you use the Interface, you are subject to the OpenPeer Privacy Policy found
					<a
						href="https://docs.google.com/document/d/e/2PACX-1vQ8bbtzcLhuA8g8gXu5nMqNS4DF0RU0dHneejLSZ0Uo9l_hFjsUqi08ZVfjosSgoZhySjFwZB5YWC37/pub"
						target="_blank"
					>
						here
					</a>
					.
				</p>
				<p className="mb-4">
					We use the information we collect to detect, prevent, and mitigate financial crime and other illicit
					or harmful activities on the Interface. For these purposes, we may share the information we collect
					with blockchain analytics providers or legal authorities as appropriate. We share information with
					these service providers only so that they can help us promote the safety, security, and integrity of
					the Interface and continuing compliance of the Platform. We do not retain the information we collect
					any longer than necessary for these purposes.
				</p>
				<p className="mb-4">
					Please note that when you use the Interface, you are interacting with the Ethereum blockchain, and
					may be interacting with additional blockchains in future iterations, which provides transparency
					into your transactions. OpenPeer Protocol does not control and is not responsible for any
					information you make public on the Ethereum blockchain nor any other applicable blockchain by taking
					actions through the Interface.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Prohibited Activity</h3>
				<p className="mb-4">
					You agree not to engage in, or attempt to engage in, any of the following categories of prohibited
					activity in relation to your access and use of the Interface:
				</p>
				<ul className="list-disc pl-6">
					<li className="mb-4">
						<span className="font-bold">Intellectual Property Infringement.</span>
						Activity that infringes on or violates any copyright, trademark, service mark, patent, right of
						publicity, right of privacy, or other proprietary or intellectual property rights under the law
					</li>
					<li className="mb-4">
						<span className="font-bold">Cyberattack.</span>
						Activity that seeks to interfere with or compromise the integrity, security, or proper
						functioning of any computer, server, network, personal device, or other information technology
						system, including (but not limited to) the deployment of viruses and denial of service attacks.
					</li>
					<li className="mb-4">
						<span className="font-bold">Fraud and Misrepresentation.</span>
						Activity that seeks to defraud us or any other person or entity, including (but not limited to)
						providing any false, inaccurate, or misleading information in order to unlawfully obtain the
						property of another.
					</li>
					<li className="mb-4">
						<span className="font-bold">Market Manipulation.</span>
						Activity that violates any applicable law, rule, or regulation concerning the integrity of
						trading markets, including (but not limited to) the manipulative tactics commonly known as “rug
						pulls”, pumping and dumping and wash trading.
					</li>
					<li className="mb-4">
						<span className="font-bold">Securities and Derivatives Violations.</span>
						Activity that violates any applicable law, rule, or regulation concerning the trading of
						securities or derivatives.
					</li>
					<li className="mb-4">
						<span className="font-bold">Any Other Unlawful Conduct.</span>
						Activity that violates any applicable law, rule, or regulation of your jurisdiction, including
						(but not limited to) the restrictions and regulatory requirements imposed by your jurisdiction
						with specific regards to use of the App for money laundering activities or terrorist financing
						or use of illicit funds from proceeds from any hack or otherwise.
					</li>
				</ul>

				<h3 className="mt-8 text-lg font-bold mb-4">
					OFAC and Sanctioned Entity and Digital Asset Addresses Prohibition.
				</h3>
				<p className="mb-4">
					Without limiting the generality in the aforementioned “Legalities” and “Prohibited Localities”
					sections, you agree that you shall not engage with the OpenPeer Protocol or any ancillary OpenPeer
					Protocol product in any manner whatsoever if you are a sanctioned entity on the U.S. Office of
					Foreign Asset Control (“OFAC”) sanctions list, own a digital asset address under the OFAC list, or
					have engaged with any entity or digital asset address on that list, directly or indirectly, in the
					receipt and/or transmission of tokens. This list includes but is not limited to any of the following
					addresses listed below and addresses which you know have interacted with the following prohibited
					addresses since August 8th, 2022 (the “Initialization of Sanction”). Such digital asset addresses
					are identified by OFAC as the prohibited Tornado Cash (a.k.a. Tornado Cash classNameic; a.k.a.
					Tornado Cash Nova) addresses. A non-exhaustive list can be found below, which as prior mentioned,
					includes any digital asset addresses which have interacted with the following explicitly sanctioned
					digital asset addresses since the Initialization of Sanction.
				</p>

				<p className="mb-4">
					0x8589427373D6D84E98730D7795D8f6f8731FDA16 0x722122dF12D4e14e13Ac3b6895a86e84145b6967
					0xDD4c48C0B24039969fC16D1cdF626eaB821d3384 0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b
					0xd96f2B1c14Db8458374d9Aca76E26c3D18364307 0x4736dCf1b7A3d580672CcE6E7c65cd5cc9cFBa9D
					0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3 0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF
					0xA160cdAB225685dA1d56aa342Ad8841c3b53f291 0xFD8610d20aA15b7B2E3Be39B396a1bC3516c7144
					0xF60dD140cFf0706bAE9Cd734Ac3ae76AD9eBC32A 0x22aaA7720ddd5388A3c0A3333430953C68f1849b
					0xBA214C1c1928a32Bffe790263E38B4Af9bFCD659 0xb1C8094B234DcE6e03f10a5b673c1d8C69739A00
					0x527653eA119F3E6a1F5BD18fbF4714081D7B31ce 0x58E8dCC13BE9780fC42E8723D8EaD4CF46943dF2
					0xD691F27f38B395864Ea86CfC7253969B409c362d 0xaEaaC358560e11f52454D997AAFF2c5731B6f8a6
					0x1356c899D8C9467C7f71C195612F8A395aBf2f0a 0xA60C772958a3eD56c1F15dD055bA37AC8e523a0D
					0x169AD27A470D064DEDE56a2D3ff727986b15D52B 0x0836222F2B2B24A3F36f98668Ed8F0B38D1a872f
					0xF67721A2D8F736E75a49FdD7FAd2e31D8676542a 0x9AD122c22B14202B4490eDAf288FDb3C7cb3ff5E
					0x905b63Fff465B9fFBF41DeA908CEb12478ec7601 0x07687e702b410Fa43f4cB4Af7FA097918ffD2730
					0x94A1B5CdB22c43faab4AbEb5c74999895464Ddaf 0xb541fc07bC7619fD4062A54d96268525cBC6FfEF
					0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc 0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936
					0x23773E65ed146A459791799d01336DB287f25334 0xD21be7248e0197Ee08E0c20D4a96DEBdaC3D20Af
					0x610B717796ad172B316836AC95a2ffad065CeaB4 0x178169B423a011fff22B9e3F3abeA13414dDD0F1
					0xbB93e510BbCD0B7beb5A853875f9eC60275CF498 0x2717c5e28cf931547B621a5dddb772Ab6A35B701
					0x03893a7c7463AE47D46bc7f091665f1893656003 0xCa0840578f57fE71599D29375e16783424023357
					0x58E8dCC13BE9780fC42E8723D8EaD4CF46943dF2 0x8589427373D6D84E98730D7795D8f6f8731FDA16
					0x722122dF12D4e14e13Ac3b6895a86e84145b6967 0xDD4c48C0B24039969fC16D1cdF626eaB821d3384
					0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b
				</p>
				<p className="mb-4">
					You agree that you are solely responsible for ensuring that your address used for the interaction
					with the OpenPeer Protocol Platform does not fall within the list above. You are also responsible to
					keep up to date as to when and if OFAC adds newly sanctioned digital asset addresses and to ensure
					that your address does not fall within the updated list. This can be done via a search at
					<a
						href="https://home.treasury.gov/policy-issues/financial-sanctions/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists"
						target="_blank"
					>
						Specially Designated Nationals And Blocked Persons List (SDN) Human Readable Lists | U.S.
						Department of the Treasury.
					</a>
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Not Registered with the SEC or Any Other Agency</h3>
				<p className="mb-4">
					We are not registered with the U.S. Securities and Exchange Commission as a national securities
					exchange or in any other capacity and are not registered with any other national financial
					derivatives or securities or other financial regulatory bodies. You understand and acknowledge that
					we do not broker trading orders on your behalf nor do we collect or earn fees from your trades,
					swaps, redemptions, lending or borrowing on the Protocol. We also do not facilitate the execution or
					settlement of your trades, swaps, redemptions, lending or borrowing which occur entirely on the
					public distributed Ethereum blockchain and which may occur on other distributed ledgers in future
					iterations and editions. The pricing information provided through the Interface does not represent
					an offer, a solicitation of an offer, or any advice regarding, or recommendation to enter into, a
					transaction with the Interface. Additionally, The Interface does not act as an agent for any of the
					users. Such trading functions are facilitated solely via smart contract in a decentralised manner
					and with no engagement, facilitation or assistance from the Organisation, the Protocol or any other
					associated party.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Non-Solicitation; No Investment Advice</h3>
				<p className="mb-4">
					You agree and understand that all trades, swaps, redemptions, lending or borrowing you submit
					through the Interface are considered unsolicited, which means that you have not received any
					investment advice from us in connection with any trades, swaps, redemptions, lending or borrowing,
					and that we do not conduct a suitability review of any trades, swaps, redemptions, lending or
					borrowing you submit.
				</p>
				<p className="mb-4">
					All information provided by the Interface is for informational purposes only and should not be
					construed as investment advice. You should not take, or refrain from taking, any action based on any
					information contained in the Interface. We do not make any investment recommendations to you or
					opine on the merits of any investment transaction or opportunity. You alone are responsible for
					determining whether any investment, investment strategy or related transaction is appropriate for
					you based on your personal investment objectives, financial circumstances, and risk tolerance and as
					appropriate, before taking any financial, legal, or other decisions involving the Interface, you
					should seek independent professional advice from an individual who is licensed and qualified in the
					area for which such advice would be appropriate.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">No Warranties</h3>
				<p className="mb-4">
					The Interface is provided on an "AS IS" and "AS AVAILABLE" basis. To the fullest extent permitted by
					law, we disclaim any representations and warranties of any kind, whether express, implied, or
					statutory, including (but not limited to) the warranties of merchantability and fitness for a
					particular purpose. You acknowledge and agree that your use of the Interface is at{' '}
					<b>your own risk</b>. We do not represent or warrant that access to the Interface will be
					continuous, uninterrupted, timely, or secure; that the information contained in the Interface will
					be accurate, reliable, complete, or current; or that the Interface will be free from errors,
					defects, viruses, or other harmful elements. No advice, information, or statement that we make
					should be treated as creating any warranty concerning the Interface. We do not endorse, guarantee,
					or assume responsibility for any advertisements, offers, or statements made by third parties
					concerning the Interface.
				</p>
				<p className="mb-4">
					OpenPeer does not facilitate or provide brokerage, exchange, payment, escrow, custody, remittance or
					merchant services. OpenPeer is only an introductory and information service, and, to the maximum
					extent permissible by law, is not responsible for any actions of its users including, without
					limitation, representations by any users regarding funds (cryptocurrency or currency) having been
					transferred or any ownership of cryptocurrency or fund
				</p>
				<p className="mb-4">
					OpenPeer makes no warranties, claims or guarantees related to any of our users, including but not
					limited to:
				</p>
				<ul className="list-disc pl-6">
					<li className="mb-2">the merchantability or fitness of the user;</li>
					<li className="mb-2">the identity of the user;</li>
					<li className="mb-2">the location of the user;</li>
					<li className="mb-2">the reliability and timeliness of the user;</li>
					<li className="mb-2">the accuracy of any information the user presents; or</li>
					<li className="mb-2">the accuracy of any information we provide about the user.</li>
				</ul>
				<p className="mb-4">
					To the maximum extent permitted by law, we make no guarantees to the safety, reliability,
					availability or longevity of any of the data we collect or store.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Non-Custodial and No Fiduciary Duties</h3>
				<p className="mb-4">
					The Interface is a purely non-custodial application, meaning you are solely responsible for the
					custody of the cryptographic private keys to the digital asset wallets you hold. This Agreement is
					not intended to, and does not, create or impose any fiduciary duties on us. To the fullest extent
					permitted by law, you acknowledge and agree that we owe no fiduciary duties or liabilities to you or
					any other party, and that to the extent any such duties or liabilities may exist at law or in
					equity, those duties and liabilities are hereby irrevocably disclaimed, waived, and eliminated. You
					further agree that the only duties and obligations that we owe you are those set out expressly in
					this Agreement.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Compliance Obligations</h3>
				<p className="mb-4">
					The Interface is operated from international facilities. By accessing or using the Interface, you
					agree that you are solely and entirely responsible for compliance with all laws and regulations that
					may apply to you, and you must ensure continuing compliance with any and all laws and regulations
					throughout your use of the interface and interaction with the protocol to the highest degree of due
					diligence. Specifically, your use of the Protocol may result in various tax consequences, such as
					income or capital gains tax, value-added tax, goods and services tax, or sales tax in certain
					jurisdictions. It is your responsibility to determine whether taxes apply to any transactions you
					initiate or receive and, if so, to report and/or remit the correct tax to the appropriate tax
					authority.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Assumption of Risk</h3>
				<p className="mb-4">
					By accessing and using the Interface, you represent that you are financially and technically
					sophisticated enough to understand the inherent risks associated with using cryptographic and
					blockchain-based systems, including the functionality, usage, storage, transmission mechanisms, and
					intricacies associated with cryptographic tokens, token storage facilities (including wallets),
					blockchain technology, and blockchain-based software systems; and that you have a working knowledge
					of the usage and intricacies of digital assets such as bitcoin (BTC), ether (ETH) and other digital
					tokens and such as those following the Ethereum Token Standard (ERC-20), other digital token
					derivatives and complex financial derivative mechanisms and any other mechanisms pertaining to Web
					3.0 applications, which encompasses the use of web interfaces to interact with blockchain based
					applications. In particular, you understand that blockchain-based transactions are irreversible and
					that Web 3.0 applications have intrinsic and unique risks and such are understood, appreciated and
					assumed by you. You further understand that the markets for digital assets are highly volatile due
					to factors including (but not limited to) adoption, speculation, technology, security, and
					regulation. You further acknowledge that we are not responsible for any of these variables or risks,
					do not own or control the Platform, and cannot be held liable for any resulting losses that you
					experience while accessing or using the Interface. Accordingly, you understand and agree to assume
					full responsibility for all of the risks of accessing and using the Interface to interact with the
					Platform.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Third-Party Resources and Promotions</h3>
				<p className="mb-4">
					The Interface may contain references or links to third-party resources, including (but not limited
					to) information, materials, products, or services, that we do not own or control. In addition, third
					parties may offer promotions related to your access and use of the Interface. We do not endorse or
					assume any responsibility for any such resources or promotions. If you access any such resources or
					participate in any such promotions, you do so at your own risk, and you understand that this
					Agreement does not apply to your dealings or relationships with any third parties. You expressly
					relieve us of any and all liability arising from your use of any such resources or participation in
					any such promotions.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Release of Claims</h3>
				<p className="mb-4">
					You expressly agree that you assume all risks in connection with your access and use of the
					Interface and your interaction with the Protocol. You further expressly waive and release the
					Organisation, Organisation members and participants and any other Organisation associated parties
					from any and all liability, claims, causes of action, or damages arising from or in any way relating
					to your use of the Interface and your interaction with the Protocol. Notwithstanding any statutory
					provision applicable to your jurisdiction applying to loans taken from unidentified third parties
					and associated benefits and protections stemming from such statutory provisions, you agree to waive
					any and all benefits and protections to the fullest extent of the law of those provisions, in light
					of the status of the platform as decentralized and peer-to-peer and in light of the intrinsic
					anonymity principles of the blockchain.
				</p>

				<h3 className="mt-8 text-lg font-bold mb-4">Indemnity</h3>
				<p className="mb-4">
					You agree to hold harmless, release, defend, and indemnify us and our officers, directors,
					employees, contractors, agents, affiliates, and subsidiaries from and against all claims, damages,
					obligations, losses, liabilities, costs, and expenses arising from: (a) your access and use of the
					Interface; (b) your violation of any term or condition of this Agreement, the right of any third
					party, or any other applicable law, rule, or regulation; and (c) any other party's access and use of
					the Interface with your assistance or using any device or account that you own or control.
				</p>
				<p className="mb-4">This includes, but is not limited to:</p>
				<ul className="list-disc pl-6">
					<li className="mb-2">breach by You of these Terms of Service;</li>
					<li className="mb-2">unauthorised use of your OpenPeer account;</li>
					<li className="mb-2">
						act or omission (including any negligence, unlawful conduct, wilful misconduct or fraud) by You
						in relation to your use of OpenPeer’s services;
					</li>
					<li className="mb-2">
						third party claim against us in relation to your use of OpenPeer’s services;
					</li>
					<li className="mb-2">
						any action taken by OpenPeer at your request in respect of your account, trade or dispute;
					</li>
					<li className="mb-2">
						any inaction or delay on your part in respect of any dispute, including any failure by you to
						respond to a request for information by us within the time required;
					</li>
					<li className="mb-2">
						any failure by You to comply with any reasonable recommendation made by OpenPeer;
					</li>
					<li className="mb-2">infringement of intellectual property rights by you; and</li>
					<li className="mb-2">any actions or inactions of third party service providers.</li>
				</ul>

				<h3 className="mt-8 text-lg font-bold mb-4">Release of Claims</h3>
				<p className="mb-4"></p>

				<ul className="list-disc pl-6">
					<li className="mb-4"></li>
				</ul>
			</div>
		</>
	);
}
