import { useState } from "react";
import { Form } from "antd";

export const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => setIsVisible(true);
  const hideModal = () => setIsVisible(false);

  return { isVisible, showModal, hideModal, form };
};