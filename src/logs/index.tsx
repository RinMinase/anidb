import { useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { Chip, Paper } from "@mui/material";
import axios from "axios";

import { ModuleContainer, Table } from "@components";

import { Data, Pagination, paginationDefaults } from "./types";

const AddChip = () => <Chip label="Add" size="small" color="success" />;
const EditChip = () => <Chip label="Edit" size="small" color="warning" />;
const DeleteChip = () => <Chip label="Delete" size="small" color="error" />;

const Logs = () => {
  const [isTableLoading, setTableLoading] = useState(true);
  const [data, setData] = useState<Data>([]);
  const [meta, setMeta] = useState<Pagination>(paginationDefaults);

  const [pagination, setPagination] = useState({
    page: paginationDefaults.page,
    limit: paginationDefaults.limit,
  });

  const fetchData = async (page?: number, limit?: number) => {
    setTableLoading(true);

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
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const handleChangePage = (_e: any, newPage: number) => {
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
        <Table.Element size="small" sx={{ minWidth: 650 }}>
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
            {!isTableLoading ? (
              data.map((item) => (
                <Table.Row hover key={item.id}>
                  <Table.Cell>
                    {item.action === "add" && <AddChip />}
                    {item.action === "edit" && <EditChip />}
                    {item.action === "delete" && <DeleteChip />}
                  </Table.Cell>
                  <Table.Cell>{item.tableChanged}</Table.Cell>
                  <Table.Cell>{item.idChanged}</Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell>{item.createdAt}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Loader />
            )}
          </Table.Body>
        </Table.Element>
      </Table.Container>

      <Table.Pagination
        rowsPerPageOptions={[30, 50, 100]}
        component="div"
        count={meta.totalResults}
        rowsPerPage={pagination.limit}
        page={pagination.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={Table.PaginationActions}
      />
    </ModuleContainer>
  );
};

export default Logs;
