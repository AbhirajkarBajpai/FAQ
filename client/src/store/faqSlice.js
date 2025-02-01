import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch FAQs
export const fetchFaqs = createAsyncThunk("faqs/getFaq", async (language) => {
  try {
    const response = await fetch(`http://localhost:5000/api/faqs/getFaq?lang=${language}`);
    if (!response.ok) throw new Error("Failed to fetch FAQs");
    return await response.json();
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
});

// Add new FAQ
export const addFaq = createAsyncThunk("faqs/addFaq", async (faq) => {
  try {
    const response = await fetch(`http://localhost:5000/api/faqs/addFaq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faq),
    });
    if (!response.ok) throw new Error("Failed to add FAQ");
    return await response.json();
  } catch (error) {
    console.error("Error adding FAQ:", error);
    throw error;
  }
});

// Update an existing FAQ
export const updateFaq = createAsyncThunk("faqs/updateFaq", async ({ id, ...faq }) => {
  try {
    const response = await fetch(`http://localhost:5000/api/faqs/updateFaq/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faq),
    });
    if (!response.ok) throw new Error("Failed to update FAQ");
    return await response.json();
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw error;
  }
});

// Delete an FAQ
export const deleteFaq = createAsyncThunk("faqs/deleteFaq", async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/faqs/deleteFaq/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete FAQ");
    return id;
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw error;
  }
});

// FAQ Slice
const faqSlice = createSlice({
  name: "faqs",
  initialState: { faqs: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => { state.loading = true; })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addFaq.fulfilled, (state, action) => {
        state.faqs.push(action.payload);
      })
      .addCase(updateFaq.fulfilled, (state, action) => {
        const index = state.faqs.findIndex((faq) => faq._id === action.payload._id);
        if (index !== -1) state.faqs[index] = action.payload;
      })
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.faqs = state.faqs.filter(faq => faq._id !== action.payload);
      });
  },
});

export default faqSlice.reducer;
