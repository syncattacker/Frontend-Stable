import { toast } from "sonner";

export const showToast = (type, message) => {
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
};
