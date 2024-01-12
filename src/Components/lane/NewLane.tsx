// Placeholder component for a new lane
// Manages the mutation for creating a new lane
"use client";
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";

import { gql } from "@/__generated__/gql";
import { useMutation } from "@apollo/client";

const ADD_NEW_LANE_MUTATION = gql(/*GraphQL*/ `
	mutation AddNewLane($objects: [laneInsertInput!]!) {
  insertIntolaneCollection(objects: $objects) {
    affectedCount
    records {
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
}
`);

export default function NewLane({
  highestLanePosition,
  boardId,
}: {
  highestLanePosition: number;
  boardId: string;
}) {
  // click on element activates editing mode
  // in editing mode an input is shown to set the new lanes name
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [newLaneName, setNewLaneName] = useState("");
  const [addLane, { loading }] = useMutation(ADD_NEW_LANE_MUTATION);
  const session = useSession();

  const handleAddLane = async () => {
    if (session?.user?.id) {
      const variables = {
        objects: [
          {
            board_id: boardId,
            title: newLaneName,
            position:
              highestLanePosition +
                Number(process.env.NEXT_PUBLIC_POS_MULTIPLIER) || 65535,
            user_id: session.user.id,
          },
        ],
      };
      await addLane({
        variables,
        update(cache, { data: { insertIntolaneCollection } }) {
          const newLane = insertIntolaneCollection.records[0];
          // The mutation seems to create the new lane in the cache
          // But we need to reference that new lane in the list of lanes on the board object in cache

          cache.modify({
            id: cache.identify({ __typename: "board", id: boardId }), // Replace `boardId` with the actual board ID
            fields: {
              laneCollection(previousLaneCollection, { toReference }) {
                //	the lane collection only holds references to the other cache objects
                //	therefore we use this handy conversion function
                return [previousLaneCollection, toReference(newLane)];
              },
            },
          });
        },
      });
      setNewLaneName("");
      setIsEditingMode(false);
    }
  };
  if (!isEditingMode)
    return (
      <div
        className="lane_card opacity-50 hover:opacity-100 cursor-pointer select-none"
        onClick={() => setIsEditingMode(true)}
      >
        <div className="flex flex-row items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add Lane
        </div>
      </div>
    );
  return (
    <div className="lane_card select-none">
      <div className="flex rounded-lg shadow-sm">
        <input
          autoFocus={true}
          onBlur={() => setIsEditingMode(false)}
          onChange={(e) => setNewLaneName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddLane()}
          type="text"
          placeholder="New Lane"
          id="hs-trailing-button-add-on"
          name="hs-trailing-button-add-on"
          className="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
        />
        <button
          type="button"
          className="primary_button"
          onClick={handleAddLane}
        >
          Add
        </button>
      </div>
    </div>
  );
}
