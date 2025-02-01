import { configureStore } from "@reduxjs/toolkit";
import faqReducer from "./faqSlice";

const store = configureStore({
  reducer: {
    faqs: faqReducer,
  },
});

export default store;
