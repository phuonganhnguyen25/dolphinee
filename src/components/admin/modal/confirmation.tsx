"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Divider,
  Button,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";

type IProps = {
  onClose: () => void;
  onOk: () => void;
  isOpen: boolean;
  loading: boolean;
  metadata: {
    title: string;
    msg: string;
  };
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  metadata,
  loading,
  onOk,
}: IProps) {
  const t_form = useTranslations("Form");

  return (
    <Modal size={"xs"} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {metadata.title}
        </ModalHeader>
        <Divider />
        {metadata.msg && <ModalBody>{metadata.msg}</ModalBody>}
        <ModalFooter>
          <Button onClick={onClose} color="danger" type="button">
            {t_form("Button.Close")}
          </Button>
          <Button isLoading={loading} onClick={onOk} color="primary" type="button">
            {t_form("Button.Submit")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
