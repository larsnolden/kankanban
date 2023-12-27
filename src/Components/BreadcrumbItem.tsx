import Link from "next/link";

export default function BreadcrumbItem({
  uri,
  title,
  showIcon,
}: {
  uri: string;
  title: string;
  showIcon: boolean;
}) {
  return (
    <li className="inline-flex items-center">
      <Link
        className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:focus:text-blue-500"
        href={uri}
      >
        {title}
      </Link>
      {showIcon && (
        <svg
          className="flex-shrink-0 mx-2 overflow-visible h-4 w-4 text-gray-400 dark:text-neutral-600 dark:text-neutral-600"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </li>
  );
}
