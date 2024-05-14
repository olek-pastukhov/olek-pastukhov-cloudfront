import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError } from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (message: string) => {
    setErrorMessage(message);
    setOpen(true);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    if (!file) {
      return;
    }

    const token = btoa(localStorage.getItem("authorization_token") || "");
    try {
      const response = await axios.get(url, {
        headers: {
          "Authorization": `Basic ${token}`
        },
        params: {
          fileName: encodeURIComponent(file.name)
        }
      });
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);

      const result = await axios.put(response.data, file, {
        headers: {
          "Content-Type": "text/csv"
        }
      });
      console.log("Result: ", result);
      setFile(undefined);
    } catch (e) {
      const error = e as AxiosError;

      if (error.response) {
        if (error.response.status === 401) {
          handleOpen("Unauthorized: Please check your credentials");
        } else if (error.response.status === 403) {
          handleOpen("Forbidden: You do not have access to this resource");
        } else {
          handleOpen("An error occurred");
        }
      }
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={"error"} sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
