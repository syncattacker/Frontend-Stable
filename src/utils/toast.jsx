import { toast } from "sonner";

export const showToast = (type, message, options = {}) => {
  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "loading":
      return toast.loading(message, options);
    default:
      toast(message, options);
  }
};