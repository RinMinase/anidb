import { Paper } from "@mui/material";
import { Trash as DeleteIcon, Edit as EditIcon } from "react-feather";

import { IconButton, Table } from "@components";
import { Data, Item } from "../types";

type Props = {
  data: Data;
  loading: boolean;
  handleEditClick: (item: Item) => void;
  handleDeleteClick: (item: Item) => void;
};

const ViewTable = (props: Props) => {
  const { data, loading, handleEditClick, handleDeleteClick } = props;

  return (
    <Table.Container
      component={Paper}
      sx={{
        maxHeight: {
          xs: undefined,
          /*
           * Calculation Description:
           * 48px - navbar
           * 48px - container padding
           * 49px - page heading
           * 48px - tab heading
           * 32px - tab spacing
           */
          md: "calc(100vh - 48px - 48px - 49px - 48px - 32px)",
        },
        overflow: {
          xs: undefined,
          md: "scroll",
        },
      }}
    >
      <Table.Element size="small" sx={{ minWidth: 650 }}>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Date</Table.Cell>
            <Table.Cell align="center">From</Table.Cell>
            <Table.Cell align="center">To</Table.Cell>
            <Table.Cell align="center">Odometer</Table.Cell>
            <Table.Cell align="center">Price / Liter</Table.Cell>
            <Table.Cell align="center">Liters Filled</Table.Cell>
            <Table.Cell />
          </Table.Row>
        </Table.Head>

        <Table.Body>
          {!loading ? (
            data.map((item) => (
              <Table.Row hover key={`fuel-${item.id}`}>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell align="center">{item.fromBars}</Table.Cell>
                <Table.Cell align="center">{item.toBars}</Table.Cell>
                <Table.Cell align="center">{item.odometer}</Table.Cell>
                <Table.Cell align="center">
                  {item.pricePerLiter ?? "-"}
                </Table.Cell>
                <Table.Cell align="center">
                  {item.litersFilled ?? "-"}
                </Table.Cell>
                <Table.Cell sx={{ textAlign: "right" }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditClick(item)}
                    children={<EditIcon size={20} />}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(item)}
                    sx={{ ml: 1 }}
                    children={<DeleteIcon size={20} />}
                  />
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Loader />
          )}
        </Table.Body>
      </Table.Element>
    </Table.Container>
  );
};

export default ViewTable;
