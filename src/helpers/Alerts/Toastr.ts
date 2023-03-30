import type { IToastr } from "@/common/@types/IToastr";
import * as toastr from "toastr/toastr.js";

const TIMEOUT = 5000;

export const TOASTR: IToastr = {
  warning: (text: any, title: string = "", timeout: number = TIMEOUT) => {
    toastr.warning(text, title, { timeOut: timeout });
  },
  success: (text: any, title: string = "", timeout: number = TIMEOUT) => {
    toastr.success(text, title, { timeOut: timeout });
  },
  error: (text: any, title: string = "", timeout: number = TIMEOUT) => {
    toastr.error(text, title, { timeOut: timeout });
  },
  remove: () => {
    toastr.remove();
  },
  clear: () => {
    toastr.clear();
  },
};
