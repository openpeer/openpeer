import { CheckIcon } from '@heroicons/react/24/outline';
import Label from 'components/Label/Label';

const steps = [
	{
		name: 'Pay Dispute Fee',
		description: 'Pay 1% of the trade amount.',
		status: 'complete'
	},
	{ name: 'Notify Mechant', description: 'Merchant has been notified', status: 'current' },
	{ name: 'Merchant Response', description: 'Merchant is yet to respond', status: 'upcoming' },
	{ name: 'Openpeer Arbitrary', description: 'Openpeer arbitrate the dispute', status: 'upcoming' }
];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

const StatusTimeLine = () => {
	return (
		<>
			<Label title="Dispute progress" />
			<nav aria-label="Progress" className="mt-4">
				<ol role="list" className="overflow-hidden">
					{steps.map((step, stepIdx) => (
						<li
							key={step.name}
							className={classNames(stepIdx !== steps.length - 1 ? 'pb-8' : '', 'relative')}
						>
							{step.status === 'complete' ? (
								<>
									{stepIdx !== steps.length - 1 ? (
										<div
											className="absolute top-4 left-3 -ml-px mt-0.5 h-full w-0.5 bg-cyan-600"
											aria-hidden="true"
										/>
									) : null}
									<div className="group relative flex items-start">
										<span className="flex h-9 items-center">
											<span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-600 group-hover:bg-cyan-800">
												<CheckIcon className="h-4 w-4 text-white" aria-hidden="true" />
											</span>
										</span>
										<span className="ml-4 flex w-full flex-row justify-between">
											<span className="flex min-w-0 flex-col">
												<span className="text-sm font-medium">{step.name}</span>
												<span className="text-sm text-gray-500">{step.description}</span>
											</span>
											<span className="text-sm text-gray-500 hidden">extra</span>
										</span>
									</div>
								</>
							) : step.status === 'current' ? (
								<>
									{stepIdx !== steps.length - 1 ? (
										<div
											className="absolute top-4 left-3 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
											aria-hidden="true"
										/>
									) : null}
									<div className="group relative flex items-start" aria-current="step">
										<span className="flex h-9 items-center" aria-hidden="true">
											<span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-cyan-600 bg-white">
												<span className="h-2 w-2 rounded-full bg-cyan-600" />
											</span>
										</span>
										<span className="ml-4 flex min-w-0 flex-col">
											<span className="text-sm font-medium text-cyan-600">{step.name}</span>
											<span className="text-sm text-gray-500">{step.description}</span>
										</span>
									</div>
								</>
							) : (
								<>
									{stepIdx !== steps.length - 1 ? (
										<div
											className="absolute top-4 left-3 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
											aria-hidden="true"
										/>
									) : null}
									<div className="group relative flex items-start">
										<span className="flex h-9 items-center" aria-hidden="true">
											<span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
												<span className="h-2 w-2 rounded-full bg-transparent group-hover:bg-gray-300" />
											</span>
										</span>
										<span className="ml-4 flex min-w-0 flex-col">
											<span className="text-sm font-medium text-gray-500">{step.name}</span>
											<span className="text-sm text-gray-500">{step.description}</span>
										</span>
									</div>
								</>
							)}
						</li>
					))}
				</ol>
			</nav>
		</>
	);
};

export default StatusTimeLine;
