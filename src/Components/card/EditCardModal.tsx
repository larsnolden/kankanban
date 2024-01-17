import { useState, useEffect, useRef } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { gql } from "@/__generated__/gql";
import { useMutation } from "@apollo/client";
interface CardUpdateT {
  title: string;
  description: string;
}

const UPDATE_CARD_MUTATION = gql(/*GraphQL*/ `
	mutation UpdateCard($set: cardUpdateInput!, $filter: cardFilter!) {
	 updatecardCollection(set: $set, filter: $filter) {
 	   affectedCount
 	   records {
 	     nodeId
 	     id
 	     title
 	     description
 	     lane_id
 	     board_id
 	     user_id
 	     created_at
 	     position
 	   }
 	  }
  }	
`);

const DELETE_CARD_MUTATION = gql(/*GraphQL*/ `
	mutation DeleteCard($filter: cardFilter!, $atMost: Int!) {
	  deleteFromcardCollection(filter: $filter, atMost: $atMost) {
	    affectedCount
	    records {
	      nodeId
	      id
	      title
	    }
	  }
	}
`);

export default function CardEditModal({
  title,
  description,
  handleCloseModal,
  cardId,
}: {
  title: string;
  description: string;
  handleCloseModal: () => void;
  cardId: string;
}) {
  const modalContentRef = useRef(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [updateCardMutation] = useMutation(UPDATE_CARD_MUTATION);
  const [deleteCardMutation] = useMutation(DELETE_CARD_MUTATION);

  const handleUpdateCard = () =>
    updateCardMutation({
      variables: {
        set: {
          title: newTitle,
          description: newDescription,
        },
        filter: {
          id: {
            eq: cardId,
          },
        },
      },
      onCompleted: handleCloseModal,
    });

  const handleDeleteCard = () =>
    deleteCardMutation({
      variables: {
        filter: {
          id: {
            eq: cardId,
          },
        },
        atMost: 1,
      },
      update(cache) {
        const normalizedId = cache.identify({ id: cardId, __typename: "card" });
        cache.evict({ id: normalizedId });
        cache.gc();
      },
    });

  // handle ESC press to close
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    }
    window.addEventListener("keydown", handleEsc);

    //  cleanup when component umnounts
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target)
    ) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-full fixed top-0 left-0 z-[1000] overflow-x-hidden overflow-y-auto transition duration bg-gray-900 bg-opacity-50 dark:bg-opacity-80">
      <div className="mt-56 opacity-100 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
        <div
          ref={modalContentRef}
          className="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="absolute top-2 end-2">
            <button
              type="button"
              className="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              onClick={handleCloseModal}
            >
              <span className="sr-only">Close</span>
              <svg
                className="flex-shrink-0 w-4 h-4"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col p-4">
            {isRenaming ? (
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                onBlur={() => setIsRenaming(false)}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleUpdateCard()}
              />
            ) : (
              <h2
                className="block text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200"
                onClick={() => setIsRenaming(true)}
              >
                {title}
              </h2>
            )}
            <textarea
              className="py-3 px-4 mt-4 min-h-48 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
              rows={3}
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-between items-center gap-x-2 py-3 px-4 bg-gray-50 border-t dark:bg-gray-800 dark:border-gray-700">
            <TrashIcon
              onClick={handleDeleteCard}
              className="w-6 h-6 cursor-pointer opacity-50 hover:opacity-100 text-red-500"
            />
            <div>
              <button
                type="button"
                className="py-2 px-3 mr-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600;"
                onClick={handleUpdateCard}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
