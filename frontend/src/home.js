import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Container,
  Card,
  CardContent,
  Paper,
  CardActionArea,
  CardMedia,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";  
import { common } from "@mui/material/colors";
import ClearIcon from "@mui/icons-material/Clear";


import image from "./bg.png";

import axios from "axios";


const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(common.white),
  backgroundColor: common.white,
  "&:hover": {
    backgroundColor: "#ffffff7a",
  },
}));

export const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [imageSelected, setImageSelected] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

 const sendFile = async () => {
  if (imageSelected) {
    try {
      let formData = new FormData();
      formData.append("file", selectedFile);

      let res = await axios.post(
        `${process.env.REACT_APP_API_URL}/predict`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Check console for details.");
    } finally {
      setIsloading(false);
    }
  }
}; 

  const clearData = () => {
    setData(null);
    setImageSelected(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) return;
    setIsloading(true);
    sendFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  // ✅ Replaces DropzoneArea
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (files) => {
      if (files && files.length > 0) {
        setSelectedFile(files[0]);
        setData(undefined);
        setImageSelected(true);
      }
    },
  });

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar
        position="static"
        sx={{ background: "#be6a77", boxShadow: "none", color: "white" }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Potato Disease Classification
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <Avatar></Avatar>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "93vh",
          marginTop: "8px",
          p: 2,
        }}
      >
        <Grid 
          container
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ pt: 4 }}
        >
          <Grid size={12}>
            <Card
              sx={{
                margin: "auto",
                maxWidth: 400,
                height: 500,
                backgroundColor: "transparent",
                boxShadow: "0px 9px 70px 0px rgb(0 0 0 / 30%)",
                borderRadius: "15px",
              }}
            >
              {imageSelected && (
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image={preview}
                    alt="Uploaded leaf"
                    sx={{ height: 400 }}
                  />
                </CardActionArea>
              )}

              {!imageSelected && (
                <CardContent>
                  <Paper
                    {...getRootProps()}
                    sx={{
                      border: "2px dashed gray",
                      p: 4,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <input {...getInputProps()} />
                    <Typography>
                      Drag & drop an image of a potato plant leaf, or click to
                      select
                    </Typography>
                  </Paper>
                </CardContent>
              )}

              {data && (
                <CardContent
                  sx={{
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <TableContainer
                    component={Paper}
                    sx={{
                      boxShadow: "none",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Label:
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Confidence:
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{data.class}</TableCell>
                          <TableCell align="right">{confidence}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}

              {isLoading && (
                <CardContent
                  sx={{
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress sx={{ color: "#be6a77" }} />
                  <Typography variant="h6" noWrap>
                    Processing
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>

          {data && (
            <Grid size={12} sx={{ maxWidth: 416, width: "100%" }}>
              <ColorButton
                variant="contained"
                size="large"
                onClick={clearData}
                startIcon={<ClearIcon fontSize="large" />}
                sx={{
                  width: "100%",
                  borderRadius: "15px",
                  padding: "15px 22px",
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "#000000a6",
                }}
              >
                Clear
              </ColorButton>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
