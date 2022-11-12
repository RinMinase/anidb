import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";

import { Chip, Paper, styled } from "@mui/material";

import { GlobalLoaderContext, ModuleContainer, Table } from "@components";

import { Data, Pagination, paginationDefaults } from "./types";

const CustomTable = styled(Table.Element)({
  minWidth: 650,
});

const AddChip = () => <Chip label="Add" size="small" color="success" />;
const EditChip = () => <Chip label="Edit" size="small" color="warning" />;
const DeleteChip = () => <Chip label="Delete" size="small" color="error" />;

const Logs = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>([]);
  const [meta, setMeta] = useState<Pagination>(paginationDefaults);

  const [pagination, setPagination] = useState({
    page: paginationDefaults.page,
    limit: paginationDefaults.limit,
  });

  const fetchData = async (page?: number, limit?: number) => {
    toggleLoader(true);

    try {
      const {
        data: { data, meta },
      } = await axios.get("/logs", {
        params: {
          page,
          limit: limit && limit !== pagination.limit ? limit : pagination.limit,
        },
      });

      setData(() => data);
      setMeta(() => meta);

      setPagination({
        page: meta.page - 1,
        limit: meta.limit,
      });
    } catch (err) {
      console.error(err);
    } finally {
      toggleLoader(false);
    }
  };

  const handleChangePage = (e: any, newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchData(newPage + 1);
  };

  const handleChangeRowsPerPage = (e: any) => {
    const el = e.target as HTMLInputElement;
    const value = parseInt(el.value) || 30;

    setPagination({ page: 0, limit: value });
    fetchData(1, value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer headerText="Logs">
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
                <Table.Row hover key={item.id}>
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
      <Table.Pagination
        rowsPerPageOptions={[30, 50, 100]}
        component="div"
        count={meta.total_data}
        rowsPerPage={pagination.limit}
        page={pagination.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </ModuleContainer>
  );
};

export default Logs;
