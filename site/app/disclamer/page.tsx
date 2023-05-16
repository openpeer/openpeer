import DocsHeader from '../../components/DocsHeader';

export default function DisclamerPage() {
	return (
		<>
			<DocsHeader />
			<div className="mx-auto py-16 px-4 w-full md:w-2/3 text-gray-800">
				<h2 className="text-2xl font-bold py-4">OPENPEER PROTOCOL DISCLAIMER</h2>
				<span className="text-gray-400">Last modified: 14 April 2023</span>

				<p className="mt-16 mb-4"></p>
				<p className="mb-4">
					OpenPeer is a decentralized self custody peer to peer protocol on the Ethereum Blockchain which
					allows users to trade crypto and fiat between each other. There is currently one version of the
					OpenPeer Protocol (v1) which is made up of free, public, open-source or source-available software
					including a set of smart contracts that are deployed on the Ethereum Blockchain and which may be
					deployed on various other blockchains as determined appropriate. Your use of the OpenPeer Protocol
					may involve various risks, including, but not limited to, losses while digital assets are being
					supplied to the OpenPeer Protocol and smart contract vulnerabilities. Before using the OpenPeer
					Protocol, you should review the relevant documentation to make sure you understand how the OpenPeer
					Protocol works, including its various intricacies, and understand and appreciate the risk of
					utilising such a protocol. Additionally, just as you can access email email protocols such as SMTP
					through multiple email clients, you can access the OpenPeer Protocol through dozens of web or mobile
					interfaces. You are responsible for doing your own due diligence on those interfaces to understand
					the fees and risks they present.
				</p>

				<p className="mb-4">
					AS DESCRIBED IN THE OPENPEER PROTOCOL TERMS OF SERVICE AGREEMENT, THE OPENPEER PROTOCOL IS PROVIDED
					"AS IS", AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND. Although OpenPeer Labs Inc. a
					corporate entity domiciled in Panama and d/b/a/ “OpenPeer Protocol” (“OpenPeer Protocol”) developed
					much of the initial code for the OpenPeer Protocol, it does not provide, own, or control the
					OpenPeer Protocol, which is run by smart contracts deployed on the Ethereum blockchain and is
					facilitated and maintained by the OpenPeer Protocol DAO (the “Organisation”) on a continuing basis.
					Upgrades and modifications to the protocol are managed in a community-driven way by holders of the
					$P2P governance token. You agree that no developer, entity or Organisation involved in creating,
					facilitating or managing the OpenPeer Protocol will be liable for any claims or damages whatsoever
					associated with your use, inability to use, or your interaction with other users of, the OpenPeer
					Protocol, including any direct, indirect, incidental, special, exemplary, punitive or consequential
					damages, or loss of profits, cryptocurrencies, tokens, or anything else of value and you waive any
					rights to all claims in any and all jurisdictions arising out of any interaction with the OpenPeer
					Protocol or the associated DAO, Organisation or d/b/a entity.
				</p>

				<p className="mb-4">
					OPENPEER PROTOCOL RESERVES THE RIGHT TO MODIFY THIS DISCLAIMER AND WILL NOTIFY YOU BY REUPLOADING A
					CURRENT VERSION OF THIS DISCLAIMER AT THE SAME LINK. ALL MODIFICATIONS WILL BE EFFECTIVE WHEN THEY
					ARE POSTED, AND YOUR CONTINUED USE OF THE OPENPEER PROTOCOL INTERFACE WILL SERVE AS CONFIRMATION OF
					YOUR ACCEPTANCE OF THESE MODIFICATIONS. IF YOU DO NOT ACCEPT MODIFICATIONS TO THIS DISCLAIMER AS MAY
					BE MADE FROM TIME-TO-TIME, YOU MUST IMMEDIATELY CEASE USING THE INTERFACE.
				</p>

				<div className="w-1/2 m-auto">
					<hr className="block my-16 border border-1 border-gray-200" />
				</div>
			</div>
		</>
	);
}
