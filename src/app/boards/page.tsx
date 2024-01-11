// React Server Component
// Displays all boards and allows to select one
import { gql } from "@/__generated__/gql";
import { getClient } from "@/apollo/ApolloClient";
import Link from "next/link";

const BOARDS_QUERY = gql(/* GraphQL */ `
  query Boards {
    boardCollection {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`);

const BoardCard = ({ title, id }: { title: string; id: string }) => (
  <div className="flex flex-col basis-1/3 mx-4 border-box bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
    <img
      className="w-full h-[250px] rounded-t-xl object-cover"
      src="https://source.unsplash.com/random/400x400"
      alt="Image Description"
    />
    <div className="p-4 md:p-5">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
        {title}
      </h3>
      <Link
        className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        href={`/board/${id}`}
      >
        Open
      </Link>
    </div>
  </div>
);

export default async function Boards() {
  const { data } = await getClient().query({ query: BOARDS_QUERY });
  console.log(JSON.stringify(data));
  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-between wrap">
        {data.boardCollection?.edges.map(({ node }) => (
          <BoardCard key={node.id} title={node.title} id={node.id} />
        ))}
      </div>
    </div>
  );
}
