import { CheckCircleIcon } from '@heroicons/react/20/solid';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

interface StepsProps {
	stepsCount: number;
	currentStep: number;
	onStepClick?: (step: number) => void;
}

const Steps = ({ currentStep, onStepClick, stepsCount }: StepsProps) => {
	return (
		<nav aria-label="Progress">
			<ol role="list" className="flex items-center justify-center md:justify-start">
				{Array.from({ length: stepsCount + 1 }, (_, i) => i + 1).map((number) => {
					const futureStep = currentStep < number;
					const actualStep = currentStep === number;
					const pastStep = currentStep > number;
					const isTheLastStep = number === stepsCount + 1;

					return (
						<li
							key={number}
							className={classNames(!isTheLastStep ? 'pr-16 sm:pr-20' : '', 'relative')}
							onClick={pastStep && !!onStepClick ? () => onStepClick(number) : undefined}
						>
							<>
								<div className="absolute inset-0 flex items-center" aria-hidden="true">
									<div className={`h-0.5 w-full ${pastStep ? 'bg-cyan-600' : 'bg-gray-200'}`} />
								</div>
								<a
									href={pastStep ? '#' : undefined}
									className={`${pastStep && 'group bg-cyan-600 hover:bg-cyan-900 text-white'} ${
										actualStep && 'border-2 border-cyan-600 bg-white text-cyan-600'
									}

                  ${
						futureStep && 'border-2 border-gray-300 bg-white hover:border-gray-400 text-gray-400'
					} relative flex h-8 w-8 items-center justify-center rounded-full `}
								>
									{isTheLastStep ? <CheckCircleIcon /> : number}
									<span className="sr-only">{number}</span>
								</a>
							</>
						</li>
					);
				})}
			</ol>
		</nav>
	);
};

export default Steps;
