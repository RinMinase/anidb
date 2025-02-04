import { createContext } from "preact";
import { useContext, useRef, useState } from "preact/hooks";
import { FixedSizeList, FixedSizeListProps } from "react-window";

const VirtualTableContext = createContext<{
  top: number;
  setTop: (top: number) => void;
  header: React.ReactNode;
  footer: React.ReactNode;
}>({
  top: 0,
  setTop: (value: number) => {},
  header: <></>,
  footer: <></>,
});

const Inner = ({ children, ...rest }: any) => {
  const { header, footer, top } = useContext(VirtualTableContext);
  return (
    <div {...rest}>
      <table style={{ top, position: "absolute", width: "100%" }}>
        {header}
        <tbody>{children}</tbody>
        {footer}
      </table>
    </div>
  );
};

export const VirtualTable = ({
  row,
  header,
  footer,
  ...rest
}: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  row: FixedSizeListProps["children"];
} & Omit<FixedSizeListProps, "children" | "innerElementType">) => {
  const listRef = useRef<FixedSizeList | null>();
  const [top, setTop] = useState(0);

  return (
    <VirtualTableContext.Provider value={{ top, setTop, header, footer }}>
      <FixedSizeList
        {...rest}
        innerElementType={Inner}
        onItemsRendered={(props) => {
          const style =
            listRef.current &&
            // @ts-ignore private method access
            listRef.current._getItemStyle(props.overscanStartIndex);
          setTop((style && style.top) || 0);

          // Call the original callback
          rest.onItemsRendered && rest.onItemsRendered(props);
        }}
        ref={(el) => (listRef.current = el)}
      >
        {row}
      </FixedSizeList>
    </VirtualTableContext.Provider>
  );
};
