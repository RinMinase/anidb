import { Edge, Node, Position } from "@xyflow/react";
import dagre from "@dagrejs/dagre";

import { MapData } from "./types";
import { LocationHook, RouteHook } from "preact-iso";

type TransformerResponse = { nodes: Node[]; edges: Edge[] };

export const transform = (
  data: MapData,
  route: RouteHook,
  location: LocationHook,
): TransformerResponse => {
  const nodes: Node[] = data.entries.map((entry) => ({
    id: entry.linkId,
    position: { x: 0, y: 0 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: {
      width: "150px !important",
      maxHeight: "80px",
      backgroundColor: entry.entryId === route.params.id ? "#ffb74d" : "white",
    },
    data: {
      label: (
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            pointerEvents: "all",
            cursor: "grab",
          }}
        >
          <span
            style={{
              display: "-webkit-box",
              webkitLineClamp: 3,
              webkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
            }}
          >
            <a
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                location.route(`/home/view/${entry.entryId}`);
              }}
              style={{
                display: "block",
                color: "#000000de",
                cursor: "pointer",
              }}
            >
              {entry.title}
            </a>
          </span>
        </div>
      ),
    },
  }));

  const edges: Edge[] = data.links.map((link) => ({
    id: `e-${link.from}-${link.to}`,
    source: link.from,
    target: link.to,
    label: link.relation,
    type: "custom",
  }));

  return { nodes, edges };
};

export const getLayout = (
  data: MapData,
  route: RouteHook,
  location: LocationHook,
  isMobile: boolean,
): TransformerResponse => {
  const { nodes, edges } = transform(data, route, location);

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "TB",
    ranksep: 50,
    nodesep: isMobile ? 20 : 50,
  });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 150, height: 80 });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target, {
      width: 100,
      height: 20,
    });
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const position = g.node(node.id);

    return {
      ...node,
      position: {
        x: position.x - 75,
        y: position.y - 25,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
