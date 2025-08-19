import * as React from "react";
import { Modal, Box, Typography } from "@mui/material";

interface ModalBoxProps {
  open: boolean;
  onClose: () => void;
  title: string;
  body: string;
  exerciseGifUrl?: string;
  exerciseDescription?: string;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 700,
  bgcolor: "#1e1e1e",
  color: "#f5f5f5",
  border: "2px solid #4caf50",
  boxShadow: 24,
  borderRadius: "16px",
  p: 3,
};

const contentWrapperStyle = {
  display: "flex",
  flexDirection: "row" as const,
  gap: "16px",
  alignItems: "flex-start",
};

const gifContainerStyle = {
  flex: 1,
  backgroundColor: "#2b2b2b",
  borderRadius: "10px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "250px",
};

const infoContainerStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
};

const descriptionBoxStyle = {
  backgroundColor: "#2a2a2a",
  borderRadius: "8px",
  padding: "12px",
  // border: "1px solid #4caf50",
};

const ModalBox: React.FC<ModalBoxProps> = ({
  open,
  onClose,
  title,
  body,
  exerciseGifUrl,
  exerciseDescription,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={contentWrapperStyle}>
          {/* GIF Section */}
          <Box sx={gifContainerStyle}>
            {exerciseGifUrl ? (
              <img
                src={exerciseGifUrl}
                alt="Exercise demo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "10px",
                }}
              />
            ) : (
              <Typography variant="body2" color="#aaa">
                No exercise GIF available
              </Typography>
            )}
          </Box>

          {/* Info Section */}
          <Box sx={infoContainerStyle}>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <Typography variant="body1">{body}</Typography>

            {exerciseDescription && (
              <Box sx={descriptionBoxStyle}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Exercise Instructions:
                </Typography>
                <Typography variant="body2" mt={1} color="#d0d0d0">
                  {exerciseDescription}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalBox;
