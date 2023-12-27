import BreadcrumbItem from "@/Components/BreadcrumbItem";

export default function Breadcrumb({
  entries,
}: {
  entries: Array<{ title: string; path: string }>;
}) {
  const getPartialUri = (i: number) =>
    entries.slice(0, i + 1).reduce((acc, curr) => {
      return `${acc}/${curr.path}`;
    }, "");

  return (
    <ol className="flex items-center whitespace-nowrap" aria-label="Breadcrumb">
      {entries.map((entry, i) => (
        <BreadcrumbItem
          title={entry.title}
          uri={getPartialUri(i)}
          showIcon={entries.length - 1 !== i}
        />
      ))}
    </ol>
  );
}
