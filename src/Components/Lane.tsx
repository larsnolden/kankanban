import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableCard, CardT } from "./Card";

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
  const [newCardTitle, setNewCardTitle] = useState("");
  const { setNodeRef } = useDroppable({ id });
  const cardsOfThisLane = cards.filter((c) => c.laneId === id);

  const handleAddNewCard = () => {
    handleCreateNewCard(id, newCardTitle);
    setNewCardTitle("");
  };
  return (
    <SortableContext
      id={id}
      items={cardsOfThisLane}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className="flex flex-col h-fit w-min- bg-gray-100 border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 mr-12"
      >
        <div className="text-xl mb-4 font-bold select-none">{title}</div>
        {cardsOfThisLane.map((card) => (
          <SortableCard
            key={card.id}
            handleParentChange={handleParentChange}
            potentialParents={potentialParentCards}
            {...card}
          />
        ))}

        <div className="mt-2">
          <label for="hs-trailing-button-add-on" className="sr-only">
            New Card
          </label>
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
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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
