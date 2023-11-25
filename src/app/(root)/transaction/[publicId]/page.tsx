interface TransactionPageProps {
  params: {
    publicId: string;
  };
}

export default function TransactionPage({ params }: TransactionPageProps) {
  return <div>{params.publicId}</div>;
}
