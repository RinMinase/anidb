import { useState } from "preact/hooks";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";

import { Box, styled, TextField } from "@mui/material";

import {
  faAngleLeft as PrevPageIcon,
  faAnglesLeft as FirstPageIcon,
  faAngleRight as NextPageIcon,
  faAnglesRight as LastPageIcon,
} from "@fortawesome/free-solid-svg-icons";

import IconButton from "./IconButton";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: any, newPage: number) => void;
}

const numericProps = {
  type: "tel",
  inputProps: {
    pattern: "[0-9]*",
    inputMode: "numeric",
    maxLength: 3,
  },
};

const PaginationTextfield = styled(TextField)({
  width: 64,
});

const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const { count, page, rowsPerPage, onPageChange } = props;

  const getLastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

  const [value, setValue] = useState("1");

  const handleFirstPageButtonClick = (event: any) => {
    onPageChange(event, 0);
    setValue("1");
  };

  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
    setValue(`${page}`);
  };

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
    setValue(`${page + 2}`);
  };

  const handleLastPageButtonClick = (event: any) => {
    onPageChange(event, getLastPage);
    setValue(`${getLastPage + 1}`);
  };

  const handleCustomPageChange = (event: any) => {
    if (event.keyCode === 13) {
      // enter key
      const el = event.target as HTMLInputElement;
      const value = (parseInt(el.value) || 1) - 1;

      if (value <= getLastPage) {
        onPageChange(event, value);
        setValue(`${value + 1}`);
      }
    }
  };

  const disableNonNumeric = (e: any) => {
    const el = e.target as HTMLInputElement;
    const value = el.value;
    const newValue = value.replaceAll(/\D/g, "");

    setValue(newValue);
    el.value = newValue;
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        <FontAwesomeSvgIcon icon={FirstPageIcon} />
      </IconButton>

      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <FontAwesomeSvgIcon icon={PrevPageIcon} />
      </IconButton>

      <PaginationTextfield
        {...numericProps}
        size="small"
        inputProps={{ style: { textAlign: "center" } }}
        onKeyDown={handleCustomPageChange}
        onChange={(e) => disableNonNumeric(e)}
        value={value}
      />

      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <FontAwesomeSvgIcon icon={NextPageIcon} />
      </IconButton>

      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <FontAwesomeSvgIcon icon={LastPageIcon} />
      </IconButton>
    </Box>
  );
};

export default TablePaginationActions;