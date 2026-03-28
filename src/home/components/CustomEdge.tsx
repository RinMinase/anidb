import { getSmoothStepPath, EdgeLabelRenderer, EdgeProps } from "@xyflow/react";

const CustomEdge = (props: EdgeProps) => {
  const { id, sourceX, sourceY, targetX, targetY, label, style } = props;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: "white",
            padding: "1px 8px",
            borderRadius: "4px",
            fontSize: "10px",
            color: "#000000de",
          }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
