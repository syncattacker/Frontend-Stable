"use client";

import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthModalProvider } from "./providers/AuthModalProvider";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthModalProvider>{children}</AuthModalProvider>
    </Provider>
  );
}
