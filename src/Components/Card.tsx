import { forwardRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Parent {
  title: string;
  id: string;
}

export interface CardT {
  title: string;
  id: string;
  pos: number;
  potentialParents?: Parent[];
  handleParentChange?: (childId: string, newParentId: string) => void;
  parentId?: string | null;
  laneId: string;
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
      listeners,
      attributes,
      parentId,
      ...rest
    }: any,
    ref
  ) => {
    const [showDetails, setShowDetails] = useState(false);
    return (
      <div
        ref={ref}
        className={`flex flex-col bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7] my-1 ${
          listeners ? "cursor-grab" : "cursor-grabbing"
        }`}
        {...listeners}
        {...attributes}
        {...rest}
      >
        <div
          data-id={id}
          className="flex justify-between items-center border-b rounded-t-xl py-3 px-4 md:px-5 dark:border-gray-700"
        >
          <h3 className="text-gray-800 dark:text-white select-none">{title}</h3>

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
        {showDetails && potentialParents && (
          <div data-no-dnd="true" className="p-4 md:p-5 flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Parent
            </label>
            <select
              value={parentId || ""}
              onChange={(e) =>
                handleParentChange && handleParentChange(id, e.target.value)
              }
              className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
            >
              {potentialParents.map((pp) => (
                <option key={pp.id} value={pp.id}>
                  {pp.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }
);

function SortableCard({
  title,
  id,
  potentialParents,
  handleParentChange,
  parentId,
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
      potentialParents={potentialParents}
      handleParentChange={handleParentChange}
      listeners={listeners}
      attributes={attributes}
      parentId={parentId}
      {...rest}
    />
  );
}

export { Card, SortableCard };
