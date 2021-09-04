import { useCallback, useState } from "react";

export function useOpenState() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen((_) => !_);
  }, [setIsOpen]);

  return {
    isOpen,
    setIsOpen,
    handleOpen,
    handleClose,
    handleToggle,
  };
}
