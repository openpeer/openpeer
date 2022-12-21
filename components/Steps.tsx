const steps = [
  { name: '1', href: '#', status: 'complete' },
  { name: '2', href: '#', status: 'upcoming' },
  { name: '3', href: '#', status: 'upcoming' },
  { name: '4', href: '#', status: 'upcoming' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface StepsProps {
  currentStep: string;
}

const Steps = ({ currentStep }: StepsProps) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-center md:justify-start">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'pr-16 sm:pr-20' : '', 'relative')}>
            {step.status === 'complete' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-cyan-600" />
                </div>
                <a
                  href="#"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 hover:bg-cyan-900 text-white"
                >
                  {step.name}
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : step.status === 'current' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-600 bg-white text-cyan-600"
                  aria-current="step"
                >
                  {step.name}
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400 text-gray-400"
                >
                  {step.name}
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Steps;
