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
import { SortableCard, CardT } from "@/Components/card/Card";
import { TrashIcon } from "@heroicons/react/24/outline";

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
          <TrashIcon
            className="w-6 h-6 cursor-pointer opacity-50 hover:opacity-100 text-red-500"
            onClick={handleDeleteLane}
          />
        </div>
        <div className="flex flex-col">
          {cardsOfThisLane.map((card) => (
            <SortableCard
              key={card.id}
              handleParentChange={handleParentChange}
              potentialParents={potentialParentCards}
              {...card}
            />
          ))}
        </div>
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
