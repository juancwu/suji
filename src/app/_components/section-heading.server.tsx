export default function SectionHeading({
  heading,
  description,
}: {
  heading: string;
  description?: string;
}) {
  return (
    <div className="border-b border-gray-200 pb-5">
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        {heading}
      </h3>
      {description && (
        <p className="test-sm mt-2 max-w-4xl text-gray-500">{description}</p>
      )}
    </div>
  );
}
