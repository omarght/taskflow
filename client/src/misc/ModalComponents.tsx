import { styled } from '@mui/system';
import { Modal, Box, Button } from '@mui/material';

// Define props for reusability
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string; // Custom width for different modals
  maxWidth?: string; // Max width constraint
  padding?: string; // Custom padding
  borderRadius?: string; // Custom border radius
  isMobile?: boolean; // Detect mobile for responsiveness
}

const StyledModal = styled(Modal)`
  overflow: scroll;
`;

const ModalContent = styled(Box)<{ isMobile: boolean }>`
  background: white;
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: ${({ isMobile }) => (isMobile ? '90%' : '700px')};
  max-width: 90vw;
  bgcolor: background.paper;
  border: 2px solid #FFF;
  box-shadow: 24px;
  padding: 16px;
  border-radius: 8px;

  @media (max-width: 768px) {
    width: 90%;
    padding: 8px;
  }
`;

const FormRow = styled(Box)`
  margin-top: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const DateTimeRow = styled(Box)`
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const TagsBox = styled(Box)`
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const ActionButton = styled(Button)`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

export {
  StyledModal,
  ModalContent,
  FormRow,
  DateTimeRow,
  TagsBox,
  ActionButton,
};