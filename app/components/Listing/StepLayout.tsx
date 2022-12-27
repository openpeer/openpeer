import Button from 'components/Button/Button';

const StepLayout = ({
  children,
  onProceed
}: {
  children?: React.ReactNode;
  onProceed: () => void;
}) => (
  <>
    {children}
    <Button title="Proceed" onClick={onProceed} />
  </>
);

export default StepLayout;
