import Button from 'components/Button/Button';
import List from 'components/List';
import Link from 'next/link';
import { useState } from 'react';

const Listing = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-16">
        <h1 className="text-2xl font-semibold text-gray-900">Choose order type</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <List />
        <Link href="/sell">
          <Button title="Proceed" />
        </Link>
      </div>
    </div>
  );
};

export default Listing;
