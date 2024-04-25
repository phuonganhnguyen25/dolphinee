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
  isOpen: boolean;
  modal_msg: string;
};

export default function NotificationModal({ isOpen, onClose, modal_msg }: IProps) {
  const t_messages = useTranslations("Messages");
  const t_form = useTranslations("Form");

  return (
    <Modal size={"xs"} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
        <Divider />
        {modal_msg && <ModalBody>{t_messages(modal_msg)}</ModalBody>}
        <ModalFooter>
          <Button onClick={onClose} color="danger" type="button">
            {t_form("Button.Close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
