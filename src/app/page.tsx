import SideLayout from "./_components/client/side-layout";

export default function Dashboard() {
  // TODO: query accounts from database
  const accounts = [
    { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
    { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
    { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
  ];

  return <SideLayout accounts={accounts}>some content</SideLayout>;
}
