import { forwardRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon } from "@heroicons/react/24/outline";
import EditCardModal from "./EditCardModal";

import { gql } from "@/__generated__/gql";
import { useFragment } from "@apollo/experimental-nextjs-app-support/ssr";

export const CARD_FRAGMENT = gql(/* GraphQL */ `
  fragment Card on cardEdge {
    node {
      id
      title
      description
      lane_id
      parent_card_id
      position
    }
  }
`);

interface Parent {
  title: string;
  id: string;
}

export interface CardT {
  title: string;
  description: string;
  id: string;
  pos: number;
  potentialParents?: Parent[];
  handleParentChange?: (childId: string, newParentId: string) => void;
  parentId?: string | null;
  laneId: string;
  handleHighlightCardConnections: () => void;
}

export interface CardTRepresentation extends Omit<CardT, "laneId"> {
  listeners?: any;
}

const Card = forwardRef(
  (
    {
      title,
      id,
      pos,
      laneId,
      potentialParents,
      handleParentChange,
      handleHighlightCardConnections,
      listeners,
      attributes,
      parentId,
      description,
      ...rest
    }: any,
    ref
  ) => {
    // const { data } = useFragment({
    //   fragment: CARD_FRAGMENT,
    //   from: { id },
    // });
    // console.log("Card  data: ", data);
    const [showDetails, setShowDetails] = useState(false);
    return (
      <>
        <div
          ref={ref}
          className={`flex flex-col bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7] my-1 ${
            listeners ? "cursor-grab" : "cursor-grabbing"
          }`}
          onMouseOver={() => {
            handleHighlightCardConnections(true);
            listeners?.onMouseOver && listeners.onMouseOver();
          }}
          onMouseLeave={() => {
            handleHighlightCardConnections(false);
            listeners?.onMouseLeave && listeners.onMouseLeave();
          }}
          {...listeners}
          {...attributes}
          {...rest}
        >
          <div
            data-id={id}
            className="flex justify-between items-center border-b rounded-t-xl py-3 px-4 md:px-5 dark:border-gray-700"
          >
            <h3 className="text-gray-800 dark:text-white select-none">
              {title}
            </h3>
            <div className="flex items-center gap-x-1 ml-8" data-no-dnd="true">
              <div className="hs-tooltip inline-block">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  type="button"
                  className="cursor-pointer hs-tooltip-toggle w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    data-slot="icon"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  <span
                    className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
                    role="tooltip"
                  >
                    Edit
                  </span>
                </button>
              </div>
              <div className="hs-tooltip inline-block">
                <button
                  onClick={() => handleParentChange(id)}
                  type="button"
                  className="cursor-pointer hs-tooltip-toggle w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>

                  <span
                    className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
                    role="tooltip"
                  >
                    Connect
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {showDetails && (
          <EditCardModal
            handleCloseModal={() => setShowDetails(false)}
            title={title}
            cardId={id}
            description={description}
          />
        )}
      </>
    );
  }
);

function SortableCard({
  title,
  description,
  id,
  potentialParents,
  handleParentChange,
  parentId,
  handleHighlightCardConnections,
  ...rest
}: CardT) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      id={id}
      title={title}
      description={description}
      potentialParents={potentialParents}
      handleParentChange={handleParentChange}
      handleHighlightCardConnections={handleHighlightCardConnections}
      listeners={listeners}
      attributes={attributes}
      parentId={parentId}
      {...rest}
    />
  );
}

export { Card, SortableCard };
