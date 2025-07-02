import { createSlice } from "@reduxjs/toolkit";
import { fetchStatictifyThunk } from "./statictifyThunk";

const statictifySlice = createSlice({
  name: "statictify",
  initialState: {
    list: [],
    total: 0,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatictifyThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStatictifyThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.list;
        state.total = action.payload.total;
      })
      .addCase(fetchStatictifyThunk.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default statictifySlice.reducer;
