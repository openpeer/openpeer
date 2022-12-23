const steps = [
  { number: 1, href: '#' },
  { number: 2, href: '#' },
  { number: 3, href: '#' },
  { number: 4, href: '#' }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface StepsProps {
  currentStep: number;
}

const Steps = ({ currentStep }: StepsProps) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-center md:justify-start">
        {steps.map(({ number }, stepIdx) => (
          <li
            key={number}
            className={classNames(
              stepIdx !== steps.length - 1 ? 'pr-16 sm:pr-20' : '',
              'relative'
            )}
          >
            {currentStep > number ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-cyan-600" />
                </div>
                <a
                  href="#"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 hover:bg-cyan-900 text-white"
                >
                  {number}
                  <span className="sr-only">{number}</span>
                </a>
              </>
            ) : currentStep === number ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-600 bg-white text-cyan-600"
                  aria-current="step"
                >
                  {number}
                  <span className="sr-only">{number}</span>
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
                  {number}
                  <span className="sr-only">{number}</span>
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
