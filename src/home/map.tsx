import { useEffect, useState } from "preact/hooks";
import { useLocation, useRoute } from "preact-iso";
import { Background, Edge, Node, ReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import axios from "axios";

import { Box, useMediaQuery, useTheme } from "@mui/material";

import { ModuleContainer } from "@components";
import { getLayout } from "./helpers";
import { MapData } from "./types";
import CustomEdge from "./components/CustomEdge";

import "@xyflow/react/dist/style.css";

function HomeMap() {
  const route = useRoute();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const {
        data: { data },
      } = (await axios.get(`/entries/${route.params.id}/map`)) as {
        data: { data: MapData };
      };

      const { nodes, edges } = getLayout(data, route, location, isMobile);

      setNodes(nodes);
      setEdges(edges);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer
      headerText="Title Map"
      handleBack={() => location.route(`/home/view/${route.params.id}`)}
    >
      <Box
        sx={{
          width: "100%",
          height: "600px",
          backgroundColor: theme.palette.mode === "dark" ? "#424242" : "white",
        }}
      >
        {!loading ? (
          <ReactFlow
            fitView
            nodes={nodes}
            edges={edges}
            edgeTypes={{ custom: CustomEdge }}
            fitViewOptions={{ padding: isMobile ? 0 : 0.3 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background />
          </ReactFlow>
        ) : null}
      </Box>
    </ModuleContainer>
  );
}

export default HomeMap;
