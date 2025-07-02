import { createSlice } from "@reduxjs/toolkit";
import { fetchIncidentsThunk } from "./securityThunk";

interface IncidentState {
  list: any[];
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: IncidentState = {
  list: [],
  total: 0,
  status: "idle",
};

const securitySlice = createSlice({
  name: "incident",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidentsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchIncidentsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.list;
        state.total = action.payload.total;
      })
      .addCase(fetchIncidentsThunk.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default securitySlice.reducer;
