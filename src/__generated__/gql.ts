/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment Card on cardEdge {\n    node {\n      id\n      title\n      description\n      lane_id\n      parent_card_id\n      position\n    }\n  }\n": types.CardFragmentDoc,
    "\n  fragment Lane on laneEdge {\n    node {\n      id\n      title\n      position\n      nodeId\n      cardCollection {\n        edges {\n          ...Card\n        }\n      }\n    }\n  }\n": types.LaneFragmentDoc,
    "\nmutation DeleteLane($filter: laneFilter!) {\n  deleteFromlaneCollection(filter: $filter) {\n    affectedCount\n    records {\n      id\n    }\n  }\n}\n": types.DeleteLaneDocument,
    "\n\tmutation AddNewLane($objects: [laneInsertInput!]!) {\n  insertIntolaneCollection(objects: $objects) {\n    affectedCount\n    records {\n      id\n      title\n      position\n      nodeId\n      cardCollection {\n        edges {\n          ...Card\n        }\n      }\n    }\n  }\n}\n": types.AddNewLaneDocument,
    "\n                   fragment NewLane on lane {\n                    id\n                    title\n                     position\n                     nodeId\n                     cardCollection {\n                       edges {\n                         ...Card\n                       }\n                     }\n                   }\n      ": types.NewLaneFragmentDoc,
    "\n  query Board($id: BigIntFilter!) {\n    boardCollection(filter: { id: $id }) {\n      edges {\n        node {\n          id\n          title\n          laneCollection {\n            edges {\n              ...Lane\n            }\n          }\n        }\n      }\n    }\n  }\n": types.BoardDocument,
    "\n  query Boards {\n    boardCollection {\n      edges {\n        node {\n          id\n          title\n        }\n      }\n    }\n  }\n": types.BoardsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Card on cardEdge {\n    node {\n      id\n      title\n      description\n      lane_id\n      parent_card_id\n      position\n    }\n  }\n"): (typeof documents)["\n  fragment Card on cardEdge {\n    node {\n      id\n      title\n      description\n      lane_id\n      parent_card_id\n      position\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment Lane on laneEdge {\n    node {\n      id\n      title\n      position\n      nodeId\n      cardCollection {\n        edges {\n          ...Card\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment Lane on laneEdge {\n    node {\n      id\n      title\n      position\n      nodeId\n      cardCollection {\n        edges {\n          ...Card\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation DeleteLane($filter: laneFilter!) {\n  deleteFromlaneCollection(filter: $filter) {\n    affectedCount\n    records {\n      id\n    }\n  }\n}\n"): (typeof documents)["\nmutation DeleteLane($filter: laneFilter!) {\n  deleteFromlaneCollection(filter: $filter) {\n    affectedCount\n    records {\n      id\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation AddNewLane($objects: [laneInsertInput!]!) {\n  insertIntolaneCollection(objects: $objects) {\n    affectedCount\n    records {\n      id\n      title\n      position\n      nodeId\n      cardCollection {\n        edges {\n          ...Card\n        }\n      }\n    }\n  }\n}\n"): (typeof documents)["\n\tmutation AddNewLane($objects: [laneInsertInput!]!) {\n  insertIntolaneCollection(objects: $objects) {\n    affectedCount\n    records {\n      id\n      title\n      position\n      nodeId\n      cardCollection {\n        edges {\n          ...Card\n        }\n      }\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n                   fragment NewLane on lane {\n                    id\n                    title\n                     position\n                     nodeId\n                     cardCollection {\n                       edges {\n                         ...Card\n                       }\n                     }\n                   }\n      "): (typeof documents)["\n                   fragment NewLane on lane {\n                    id\n                    title\n                     position\n                     nodeId\n                     cardCollection {\n                       edges {\n                         ...Card\n                       }\n                     }\n                   }\n      "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Board($id: BigIntFilter!) {\n    boardCollection(filter: { id: $id }) {\n      edges {\n        node {\n          id\n          title\n          laneCollection {\n            edges {\n              ...Lane\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Board($id: BigIntFilter!) {\n    boardCollection(filter: { id: $id }) {\n      edges {\n        node {\n          id\n          title\n          laneCollection {\n            edges {\n              ...Lane\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Boards {\n    boardCollection {\n      edges {\n        node {\n          id\n          title\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Boards {\n    boardCollection {\n      edges {\n        node {\n          id\n          title\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;