import React from 'react';
import Button from 'components/Button/Button';
import Label from 'components/Label/Label';
import ClipboardText from 'components/Buy/ClipboardText';
import StepLayout from './StepLayout';

const FundEscrow = () => {
	<StepLayout onProceed={''} buttonText="Deposit USDT">
		<div className="my-8">
			<Label title="Fund Escrow Contract" extraStyle="font-bold" />
			<div className="mb-4">
				<div className="text-sm text-gray-600 mb-8">
					Deposit USDT into your Escrow Contract. The amount you deposit will be available for other traders
					to buy. You will have to acknowledge receipt of funds before escrowed crypto is released on any
					trade.
				</div>
				<div className="flex flex-col space-y-2 justify-center items-center">
					<Button title="Deposit USDT" />
					<span className="text-sm text-gray-500">Funds can be withdrawn at any time</span>
				</div>
				<div className="mt-8">
					<Label title="or deposit from your exchange" extraStyle="font-bold my-8" />
					<div className="mt-2 mb-4">
						<div className="border border-gray-200 rounded-lg">
							<div className="py-4 px-8">QR Code</div>
							<div className="border-t border-gray-200 pt-6 px-8">
								<span className="">USDT Address</span>
								<ClipboardText itemValue="Marcos 02B02345c02ox84" />
							</div>
							<div className="flex flex-row space-x-2 py-4 px-8">
								<div className="flex flex-row space-x-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 32 32"
										fill="none"
									>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
											fill="#6F41D8"
										></path>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M21.0921 12.693C20.7231 12.478 20.2441 12.478 19.8381 12.693L16.9591 14.347L15.0041 15.425L12.1251 17.078C11.7561 17.294 11.2771 17.294 10.8711 17.078L8.58306 15.784C8.21406 15.569 7.95606 15.174 7.95606 14.742V12.19C7.95606 11.759 8.17706 11.364 8.58306 11.148L10.8331 9.89C11.2031 9.674 11.6831 9.674 12.0891 9.89L14.3391 11.148C14.7091 11.364 14.9671 11.759 14.9671 12.19V13.844L16.9221 12.729V11.076C16.9242 10.8613 16.8668 10.6502 16.7561 10.4662C16.6454 10.2823 16.4858 10.1326 16.2951 10.034L12.1251 7.662C11.7561 7.446 11.2771 7.446 10.8711 7.662L6.62706 10.034C6.43635 10.1326 6.27677 10.2823 6.16607 10.4662C6.05537 10.6502 5.9979 10.8613 6.00006 11.076V15.856C6.00006 16.288 6.22106 16.683 6.62706 16.899L10.8711 19.271C11.2401 19.486 11.7201 19.486 12.1251 19.271L15.0041 17.653L16.9591 16.539L19.8381 14.922C20.2071 14.706 20.6861 14.706 21.0921 14.922L23.3431 16.18C23.7131 16.395 23.9701 16.79 23.9701 17.222V19.774C23.9701 20.205 23.7501 20.6 23.3431 20.816L21.0931 22.11C20.7231 22.326 20.2431 22.326 19.8381 22.11L17.5871 20.852C17.2171 20.636 16.9591 20.241 16.9591 19.81V18.156L15.0041 19.271V20.924C15.0041 21.355 15.2251 21.751 15.6311 21.966L19.8751 24.338C20.2441 24.554 20.7231 24.554 21.1291 24.338L25.3731 21.966C25.7421 21.751 26.0001 21.356 26.0001 20.924V16.144C26.0022 15.9293 25.9448 15.7182 25.8341 15.5343C25.7234 15.3503 25.5638 15.2006 25.3731 15.102L21.0931 12.693H21.0921Z"
											fill="white"
										></path>
									</svg>
									<span className="text-sm">Polygon</span>
								</div>
								<div className="text-sm font-bold">
									Only deposit on Polygon network otherwise funds will be lost
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</StepLayout>;
};

export default FundEscrow;
