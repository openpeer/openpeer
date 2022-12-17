

export default function HomePage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Replace with your content */}
        <div className="py-4">
          <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
        </div>
        {/* /End replace */}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: { title: 'P2P' } // will be passed to the page component as props
  };
}
