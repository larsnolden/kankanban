"use client";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { gql } from "@/__generated__/gql";
import { useMutation } from "@apollo/client";
import { useFragment } from "@apollo/experimental-nextjs-app-support/ssr";
import { SortableCard, CardT } from "@/Components/Card";

export const LANE_FRAGMENT = gql(/* GraphQL */ `
  fragment Lane on laneEdge {
    node {
      id
      title
      position
      nodeId
      cardCollection {
        edges {
          ...Card
        }
      }
    }
  }
`);

const DELETE_LANE_MUTATION = gql(/*GraphQL*/ `
mutation DeleteLane($filter: laneFilter!) {
  deleteFromlaneCollection(filter: $filter) {
    affectedCount
    records {
      id
    }
  }
}
`);

function Lane({
  title,
  cards,
  id,
  handleCreateNewCard,
  handleParentChange,
  potentialParentCards,
}: {
  title: string;
  cards: CardT[];
  potentialParentCards: CardT[];
  id: string;
  handleParentChange: (cardId: string) => void;
  handleCreateNewCard: (laneId: string, title: string) => void;
}) {
  // const { data } = useFragment({
  //   from: { id },
  //   fragment: LANE_FRAGMENT,
  // });

  //console.log("Lane data: ", data);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [deleteLane] = useMutation(DELETE_LANE_MUTATION);
  const { setNodeRef } = useDroppable({ id });
  const cardsOfThisLane = cards.filter((c) => c.laneId === id);

  const handleAddNewCard = () => {
    handleCreateNewCard(id, newCardTitle);
    setNewCardTitle("");
  };

  const handleDeleteLane = () =>
    deleteLane({
      variables: {
        filter: {
          id: {
            eq: id,
          },
        },
      },
      update(cache) {
        const normalizedId = cache.identify({ id, __typename: "lane" });
        cache.evict({ id: normalizedId });
        cache.gc();
      },
    });

  return (
    <SortableContext
      id={id}
      items={cardsOfThisLane}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className="lane_card">
        <div className="flex flex-row justify-between w-full">
          <div className="text-xl mb-4 font-bold select-none">{title}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="red"
            className="w-6 h-6 cursor-pointer opacity-50 hover:opacity-100"
            onClick={handleDeleteLane}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </div>
        {cardsOfThisLane.map((card) => (
          <SortableCard
            key={card.id}
            handleParentChange={handleParentChange}
            potentialParents={potentialParentCards}
            {...card}
          />
        ))}

        <div className="mt-2">
          <label className="sr-only">New Card</label>
          <div className="flex rounded-lg shadow-sm">
            <input
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNewCard()}
              type="text"
              placeholder="New Card"
              id="hs-trailing-button-add-on"
              name="hs-trailing-button-add-on"
              className="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
            />
            <button
              onClick={handleAddNewCard}
              type="button"
              className="primary_button"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </SortableContext>
  );
}

export default Lane;
