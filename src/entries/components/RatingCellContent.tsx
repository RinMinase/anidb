type Props = {
  rating: number;
};

export const RatingCellContent = ({ rating }: Props) => {
  return (
    <p
      style={{
        margin: 0,
        textAlign: "right",
        width: "100%",
        display: "inline-block",
        paddingRight: !rating ? "12px" : undefined,
        fontWeight: rating >= 4 ? "bold" : undefined,
        fontSize: rating >= 4 ? "13px" : "11px",
        color: !rating
          ? "#9e9e9e"
          : rating >= 4
            ? "#28a745"
            : rating >= 3
              ? "#1e90ff"
              : "#e57373",
      }}
    >
      {rating ? `${rating} / 5` : "-"}
    </p>
  );
};
