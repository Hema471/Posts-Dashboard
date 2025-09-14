import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://dummyjson.com/posts";

// Fetch posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ search, page, limit }) => {
    const skip = (page - 1) * limit;
    const res = await fetch(
      `${API_URL}/search?q=${search}&limit=${limit}&skip=${skip}`
    );
    return await res.json();
  }
);

// Add post
export const addPost = createAsyncThunk("posts/addPost", async (formData) => {
  const res = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData, userId: 1 }),
  });
  return await res.json();
});

// Update post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, formData }) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return { id, formData, res: data };
  }
);

// Delete post
export const deletePost = createAsyncThunk("posts/deletePost", async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return id;
});

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    list: [],
    error: null,
    total: 0,
    page: 1,
    search: "",
    limit: 10,

    // loading states
    loading: false,
    adding: false,
    updating: false,
    deleting: false, // track which post is being deleted
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearch: (state, action) => {
      state.page = 1;
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.posts;
        state.total = action.payload.total;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch posts";
      })

      // Add
      .addCase(addPost.pending, (state) => {
        state.adding = true;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.adding = false;
        state.list.unshift(action.payload);
      })
      .addCase(addPost.rejected, (state) => {
        state.adding = false;
      })

      // Update
      .addCase(updatePost.pending, (state) => {
        state.updating = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.updating = false;

        state.list = state.list?.map((post) => {
          if (post.id !== action.payload?.id) return post;

          // if no error message → use res, otherwise fallback to formData
          return !action.payload?.res?.message
            ? action.payload?.res // to keep Tags, Reactions and Views
            : action.payload?.formData;
        });
      })
      .addCase(updatePost.rejected, (state) => {
        state.updating = false;
      })

      // Delete
      .addCase(deletePost.pending, (state, action) => {
        state.deleting = action.meta.arg; // track the id being deleted
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.deleting = null;
        state.list = state.list?.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state) => {
        state.deleting = null;
      });
  },
});

export const { setPage, setSearch } = postsSlice.actions;
export default postsSlice.reducer;
