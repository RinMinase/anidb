import { useEffect, useState } from "preact/hooks";
import { AlertTriangle as NearingIcon, X as LimitIcon } from "react-feather";
import { toast } from "sonner";
import axios from "axios";

import { Box, Grid, Paper, Typography } from "@mui/material";

import { Table } from "@components";
import { Guide, MaintenanceData } from "../types";

type Props = {
  maintenanceData: MaintenanceData;
};

const MaintenanceGuide = (props: Props) => {
  const { maintenanceData: maintenance } = props;

  const [guide, setGuide] = useState<Guide>({ km: [], year: [] });

  const fetchGuide = async () => {
    try {
      const {
        data: { data },
      } = await axios.get("/fourleaf/gas/guide");

      setGuide(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  useEffect(() => {
    fetchGuide();
  }, []);

  return (
    <Grid container spacing={2} width="100%">
      <Grid size={{ xs: 12, sm: 6, md: 12 }}>
        <Typography variant="subtitle1">Maintenance by KM</Typography>
        <Table.Container component={Paper}>
          <Table.Element size="small">
            <Table.Head>
              <Table.Row>
                <Table.Cell>Label</Table.Cell>
                <Table.Cell align="center">KM</Table.Cell>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {guide.km.map((item) => (
                <Table.Row hover key={`km_${item.type}`}>
                  <Table.Cell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <span>{item.label}</span>

                      {maintenance.km[item.typeCamel] === "limit" ? (
                        <LimitIcon size={22} strokeWidth={3} color="#d32f2f" />
                      ) : maintenance.km[item.typeCamel] === "nearing" ? (
                        <NearingIcon
                          size={16}
                          strokeWidth={2}
                          color="#f57c00"
                        />
                      ) : null}
                    </Box>
                  </Table.Cell>
                  <Table.Cell align="center">{item.km}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Element>
        </Table.Container>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 12 }}>
        <Typography variant="subtitle1">Maintenance by Year</Typography>
        <Table.Container component={Paper}>
          <Table.Element size="small">
            <Table.Head>
              <Table.Row>
                <Table.Cell>Label</Table.Cell>
                <Table.Cell align="center">Years</Table.Cell>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {guide.year.map((item) => (
                <Table.Row hover key={`year_${item.type}`}>
                  <Table.Cell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <span>{item.label}</span>

                      {maintenance.year[item.typeCamel] === "limit" ? (
                        <LimitIcon size={22} strokeWidth={3} color="#d32f2f" />
                      ) : maintenance.year[item.typeCamel] === "nearing" ? (
                        <NearingIcon
                          size={16}
                          strokeWidth={2}
                          color="#f57c00"
                        />
                      ) : null}
                    </Box>
                  </Table.Cell>
                  <Table.Cell align="center">{item.year}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Element>
        </Table.Container>
      </Grid>
    </Grid>
  );
};

export default MaintenanceGuide;
