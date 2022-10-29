import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";

import { Box, Chip, Paper, styled } from "@mui/material";

import { GlobalLoaderContext, Table } from "@components";

import { Data } from "./types";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const CustomTable = styled(Table.Element)({
  minWidth: 650,
});

const AddChip = () => <Chip label="Add" size="small" color="success" />;
const EditChip = () => <Chip label="Edit" size="small" color="warning" />;
const DeleteChip = () => <Chip label="Delete" size="small" color="error" />;

const Logs = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>([]);

  const fetchData = async () => {
    try {
      const {
        data: { data },
      } = await axios.get("/logs");

      setData(() => data);
    } catch (err) {
      console.error(err);
    } finally {
      toggleLoader(false);
    }
  };

  useEffect(() => {
    toggleLoader(true);
    fetchData();
  }, []);

  return (
    <ModuleContainer>
      <Table.Container component={Paper}>
        <CustomTable size="small">
          <Table.Head>
            <Table.Row>
              <Table.Cell>Action</Table.Cell>
              <Table.Cell>Table</Table.Cell>
              <Table.Cell>Item ID</Table.Cell>
              <Table.Cell>Description</Table.Cell>
              <Table.Cell>Timestamp</Table.Cell>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {!isLoading ? (
              data.map((item) => (
                <Table.Row hover key={item.uuid}>
                  <Table.Cell>
                    {item.action === "add" && <AddChip />}
                    {item.action === "edit" && <EditChip />}
                    {item.action === "delete" && <DeleteChip />}
                  </Table.Cell>
                  <Table.Cell>{item.table_changed}</Table.Cell>
                  <Table.Cell>{item.id_changed}</Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell>{item.created_at}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Loader />
            )}
          </Table.Body>
        </CustomTable>
      </Table.Container>
    </ModuleContainer>
  );
};

export default Logs;
