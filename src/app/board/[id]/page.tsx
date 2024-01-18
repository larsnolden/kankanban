"use client";
import { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { DragStartEvent } from "@dnd-kit/core";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { gql } from "@/__generated__/gql";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useMutation } from "@apollo/client";
import { useSession } from "@supabase/auth-helpers-react";
import { MouseSensor } from "@/helper/noDnd";
import Lane from "@/Components/lane/Lane";
import NewLane from "@/Components/lane/NewLane";
import { CardT, Card } from "@/Components/card/Card";

const POS_MULTIPLIER = Number(process.env.NEXT_PUBLIC_POS_MULTIPLIER) || 65535;

const sortByPos = (c1: { pos: number }, c2: { pos: number }) => {
  if (c1.pos === c2.pos) return 0;
  return c1.pos > c2.pos ? 1 : -1;
};

const BOARD_LANES_QUERY = gql(/* GraphQL */ `
  query Board($id: BigIntFilter!) {
    boardCollection(filter: { id: $id }) {
      edges {
        node {
          id
          title
          laneCollection {
            edges {
              ...Lane
            }
          }
        }
      }
    }
  }
`);

const ADD_CARD_MUTATION = gql(/*GraphQL*/ `
	mutation AddNewCard($cards: [cardInsertInput!]!) {
		insertIntocardCollection(objects: $cards) {
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

const UPDATE_CARD_MUTATION = gql(/*GraphQL*/ `
	mutation UpdateCard2($set: cardUpdateInput!, $filter: cardFilter!) {
	 updatecardCollection(set: $set, filter: $filter) {
 	   affectedCount
 	   records {
 	     nodeId
 	     id
 	     title
 	     description
			 parent_card_id
 	     lane_id
 	     board_id
 	     user_id
 	     created_at
 	     position
 	   }
 	  }
  }	
`);

const DEFAULT_LINE_OPACITY = 0.2;
// store the fabri.js line instances by cardId
let cardToFabricElementMapping: {
  [cardId: string]: Array<fabric.Circle | fabric.Path>;
} = {};

function App() {
  const session = useSession();
  const { id: boardId }: { id: string } = useParams();
  const [addCardMutation] = useMutation(ADD_CARD_MUTATION);
  const [updateCardMutation] = useMutation(UPDATE_CARD_MUTATION);
  const { data } = useSuspenseQuery(BOARD_LANES_QUERY, {
    variables: {
      id: {
        eq: boardId,
      },
    },
  });

  const [activeCard, setActiveCard] = useState<CardT | null>(null);
  const { editor, onReady } = useFabricJSEditor();
  const [selectedChild, setSelectedChild] = useState<CardT | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(useSensor(MouseSensor));

  const lanes = data.boardCollection?.edges[0]?.node.laneCollection?.edges.map(
    ({ node }) => ({
      id: node.id,
      pos: node.position,
      title: node.title,
      cards: node.cardCollection,
    })
  );

  const cards = lanes
    ?.map((lane) =>
      lane.cards?.edges.map(({ node }) => ({
        laneId: node.lane_id,
        id: node.id,
        title: node.title,
        pos: node.position,
        description: node.description,
        parentId: node.parent_card_id,
        handleHighlightCardConnections: (highlight: boolean) =>
          handleHighlightCardConnections(node.id, highlight),
      }))
    )
    .flat() as CardT[];

  console.log("cards", cards);

  const handleHighlightCardConnections = (
    cardId: string,
    highlight: boolean
  ) => {
    const fabricElements = cardToFabricElementMapping[cardId];
    if (fabricElements) {
      fabricElements.map((element) =>
        //	@ts-ignore
        element.set("opacity", highlight ? 1 : DEFAULT_LINE_OPACITY)
      );
      editor?.canvas.renderAll();
    }
  };

  const drawLineBetweenElements = (
    child: Element,
    parent: Element,
    offset: DOMRect,
    childCardId: string,
    parentCardId: string
  ) => {
    const childRect = child.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    const circleRadius = 7;

    // Adjust starting and ending points by the offset
    const adjustedParentLeft = parentRect.left - offset.left;
    const adjustedChildRight = childRect.right - offset.left;
    const adjustedStartHeight =
      childRect.top + childRect.height / 2 - offset.top;
    const adjustedEndHeight =
      parentRect.top + parentRect.height / 2 - offset.top;

    const distanceBetween =
      adjustedParentLeft - adjustedChildRight - circleRadius;
    const heightBetween = Math.abs(adjustedStartHeight - adjustedEndHeight);

    // Create the line with adjusted coordinates
    const line = new fabric.Path(
      `M ${adjustedChildRight + circleRadius / 2} ${adjustedStartHeight} Q ${
        adjustedChildRight + circleRadius / 2 + distanceBetween / 10
      } ${adjustedStartHeight} ${
        adjustedChildRight + circleRadius / 2 + distanceBetween / 2
      } ${
        adjustedStartHeight > adjustedEndHeight
          ? adjustedEndHeight + heightBetween / 2
          : adjustedStartHeight + heightBetween / 2
      } T ${adjustedParentLeft - circleRadius / 2} ${adjustedEndHeight}`,
      {
        fill: "",
        stroke: "#2563eb",
        strokeWidth: 3,
        opacity: DEFAULT_LINE_OPACITY,
      }
    );

    // Create circles at the start and end points of the line
    const startCircle = new fabric.Circle({
      left: adjustedChildRight - circleRadius,
      top: adjustedStartHeight - circleRadius,
      radius: circleRadius,
      fill: "#2563eb",
      opacity: DEFAULT_LINE_OPACITY,
      startAngle: -90,
      endAngle: 90,
    });

    const endCircle = new fabric.Circle({
      left: adjustedParentLeft - circleRadius,
      top: adjustedEndHeight - circleRadius,
      radius: circleRadius,
      fill: "#2563eb",
      opacity: DEFAULT_LINE_OPACITY,
      startAngle: 90,
      endAngle: -90,
    });

    cardToFabricElementMapping[childCardId] = [line, startCircle, endCircle];
    // parents can have multiple lines associated
    cardToFabricElementMapping[parentCardId] = cardToFabricElementMapping[
      parentCardId
    ]
      ? [
          ...cardToFabricElementMapping[parentCardId],
          line,
          startCircle,
          endCircle,
        ]
      : [line, startCircle, endCircle];

    // Add line and circles to the canvas
    editor?.canvas.add(line, startCircle, endCircle);
  };

  const drawConnections = () => {
    if (containerRef.current) {
      // reset all line references
      cardToFabricElementMapping = {};

      // clear all existing connections
      editor?.canvas.clear();

      // offset due to padding and scroll
      const offset = containerRef.current.getBoundingClientRect();

      cards?.forEach((card) => {
        if (card && card.parentId) {
          const childElement = containerRef?.current?.querySelector(
            `[data-id="${card.id}"]`
          );
          const parentElement = containerRef?.current?.querySelector(
            `[data-id="${card.parentId}"]`
          );
          if (childElement && parentElement) {
            drawLineBetweenElements(
              childElement,
              parentElement,
              offset,
              card.id,
              card.parentId
            );
          }
        }
      });
    }
  };

  const updateCard = (card: CardT) => {
    updateCardMutation({
      variables: {
        set: {
          title: card.title,
          position: card.pos,
          lane_id: card.laneId,
          parent_card_id: card.parentId,
        },
        filter: {
          id: {
            eq: card.id, // Assuming '123' is the ID of the card you want to update
          },
        },
      },
      // this optimistic-response makes the dragging and dropping of cards instant
      optimisticResponse: {
        updatecardCollection: {
          records: [
            {
              __typename: "card",
              id: card.id,
              title: card.title,
              position: card.pos,
              lane_id: card.laneId,
              parent_card_id: card.parentId,
              description: card.description,
              board_id: boardId,
              user_id: session?.user?.id || "",
              created_at: "",
              nodeId: "",
            },
          ],
          affectedCount: 1,
        },
      },
      onCompleted: drawConnections,
    });
  };

  const createNewCard = (laneId: string, title: string) => {
    // add card on top of list
    // assume that `cards` is sorted
    let pos = POS_MULTIPLIER;
    const laneCards = cards
      .filter((card) => card?.laneId === laneId)
      .sort(sortByPos);
    if (laneCards.length > 0) {
      const posOfFirstCardInList = laneCards[0]?.pos || POS_MULTIPLIER;
      pos = posOfFirstCardInList / 2;
    }
    if (session?.user?.id) {
      addCardMutation({
        variables: {
          cards: [
            {
              board_id: boardId,
              title: title,
              lane_id: laneId,
              position: pos,
              user_id: session.user.id,
            },
          ],
        },
        // @ts-ignore
        update(cache, { data: { insertIntocardCollection } }) {
          const newCard = insertIntocardCollection.records[0];

          cache.modify({
            id: cache.identify({ __typename: "lane", id: laneId }),
            fields: {
              cardCollection(previousCardCollection, { toReference }) {
                return [previousCardCollection, toReference(newCard)];
              },
            },
          });
        },
      });
    }
  };

  useEffect(() => {
    if (editor) {
      editor.canvas.selection = false;
      drawConnections();
    }

    // Add the scroll event listener
    const container = containerRef.current;
    if (container) {
      const handleScroll = () => {
        // Debounce or throttle this if needed
        drawConnections();
      };

      container.addEventListener("scroll", handleScroll);

      // Clean up
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [editor, cards, drawConnections]);

  const handleParentChange = (id: string) => {
    if (!selectedChild)
      setSelectedChild(cards.find((c) => c.id === id) || null);
    else if (id !== selectedChild.id) {
      cards.map((card) =>
        card.id === selectedChild.id
          ? updateCard({ ...card, parentId: id })
          : card
      );
      setSelectedChild(null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (active && over) {
      console.log("handleDragOver", handleDragOver);
      const activeLaneId =
        active.data?.current?.sortable?.containerId || active.id;
      const overLaneId = over.data?.current?.sortable?.containerId || over.id;

      // the id of the card above/over
      if (activeLaneId === overLaneId || !activeLaneId || !overLaneId)
        return null;
      if (activeLaneId !== overLaneId) {
        const cardsOfLane = cards.filter((c) => c.laneId === overLaneId);

        let cardAbovePos;
        let cardBelowPos;

        // find the card below
        const cardBelowId = over.id;
        const cardBelow = cards.find((c) => c.id === cardBelowId);
        if (cardBelow) {
          cardBelowPos = cardBelow.pos;
        }
        const cardsAbove = cardBelow
          ? cardsOfLane.sort(sortByPos).filter((c) => c.pos < cardBelow.pos)
          : cardsOfLane.sort(sortByPos);
        if (cardsAbove.length > 0) {
          cardAbovePos = cardsAbove[cardsAbove.length - 1].pos;
        }

        let pos: number;
        if (cardAbovePos && cardBelowPos) {
          pos = (cardBelowPos - cardAbovePos) / 2;
        } else if (cardAbovePos) {
          pos = cardAbovePos + POS_MULTIPLIER;
        } else if (cardBelowPos) {
          pos = cardBelowPos / 2;
        } else {
          pos = POS_MULTIPLIER;
        }

        cards.map((c) =>
          c.id === active.id
            ? updateCard({
                ...c,
                laneId: overLaneId,
                pos,
              })
            : c
        );
      }
    }
    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    // fires after a draggable element is dropped
    const { active, over } = event;
    if (active && over) {
      const activeLaneId = active.data?.current?.sortable?.containerId;
      const overLaneId = over.data?.current?.sortable?.containerId;

      // do nothing if lanes changed
      if (activeLaneId !== overLaneId || !activeLaneId || !overLaneId)
        return null;

      let pos = 0;

      const cardsOfLane = cards
        .filter((c) => c.laneId === activeLaneId)
        .sort(sortByPos);

      const overCard = cardsOfLane.find((c) => c.id === over.id);
      if (overCard) {
        const cardsBelowOverCard = cardsOfLane.filter(
          (c) => c.pos > overCard.pos
        );
        const cardWasBelowOverCard = cardsBelowOverCard
          .map((c) => c.id)
          .includes(String(active.id));

        if (cardWasBelowOverCard) {
          // then the card should now be above the `over card`
          const cardAboveOverCardIdx = cardsOfLane.indexOf(overCard) - 1;
          if (cardAboveOverCardIdx >= 0) {
            const cardAboveOverCard = cardsOfLane[cardAboveOverCardIdx];
            pos = overCard.pos - (overCard.pos - cardAboveOverCard.pos) / 2;
          } else {
            // there is no card above
            pos = overCard.pos / 2;
          }
        } else {
          // if the card was above the `over` card, then it should now be below the `over` card
          const cardBelowOverCardIdx = cardsOfLane.indexOf(overCard) + 1;
          if (cardBelowOverCardIdx <= cardsOfLane.length - 1) {
            // there is a card below
            const cardBelowOverCard = cardsOfLane[cardBelowOverCardIdx];
            pos = overCard.pos + (cardBelowOverCard.pos - overCard.pos) / 2;
          } else {
            pos = overCard.pos + POS_MULTIPLIER;
          }
        }
      }

      return cards.map((c) =>
        c.id === active.id
          ? updateCard({
              ...c,
              laneId: overLaneId,
              pos,
            })
          : c
      );
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveCard(cards.find((c) => c.id === active.id) || null);
  };

  return (
    <div className="h-full overflow-x-scroll" ref={containerRef}>
      <FabricJSCanvas
        // pointer-events-none
        className="absolute h-full w-full pointer-events-none z-30"
        onReady={onReady}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
      >
        <div className="flex flex-row z-10">
          {lanes &&
            lanes
              .sort(sortByPos)
              .map((lane) => (
                <Lane
                  id={lane.id}
                  title={lane.title}
                  cards={cards
                    .filter((c) => c.laneId === lane.id)
                    .sort(sortByPos)}
                  handleParentChange={handleParentChange}
                  potentialParentCards={cards.filter(
                    (c) => c.laneId !== lane.id
                  )}
                  handleCreateNewCard={createNewCard}
                />
              ))}
          <NewLane
            highestLanePosition={
              lanes && lanes.length > 0
                ? lanes.sort(sortByPos)[lanes.length - 1].pos
                : 0
            }
            boardId={boardId}
          />
        </div>
        <DragOverlay>
          {(activeCard && <Card key={activeCard.id} {...activeCard} />) || null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default App;
