  import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
  import axios from "axios";

  const CONVERSATION_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/conversation`;
  const MESSAGE_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/message`;

  const initialState = {
    status: "",
    error: "",
    conversations: [],
    activeConversation: {},
    messages: [],
    notifications: [],
    files: [],
  };

  //functions
  export const getConversations = createAsyncThunk(
    "conervsation/all",
    async (token, { rejectWithValue }) => {
      try {
        const { data } = await axios.get(CONVERSATION_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return data;
      } catch (error) {
        return rejectWithValue(error.response.data.error.message);
      }
    }
  );

  export const open_create_conversation = createAsyncThunk(
    "conervsation/open_create",
    async (values, { rejectWithValue }) => {
      const { token, receiver_id, isGroup } = values;
      try {
        const { data } = await axios.post(
          CONVERSATION_ENDPOINT,
          { receiver_id, isGroup },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return data;
      } catch (error) {
        return rejectWithValue(error.response.data.error.message);
      }
    }
  );

  export const getConversationMessages = createAsyncThunk(
    "conervsation/messages",
    async (values, { rejectWithValue }) => {
      const { token, convo_id } = values;
      try {
        const { data } = await axios.get(`${MESSAGE_ENDPOINT}/${convo_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return data;
      } catch (error) {
        return rejectWithValue(error.response.data.error.message);
      }
    }
  );

  export const sendMessage = createAsyncThunk(
    "message/send",
    async (values, { rejectWithValue }) => {
      const { token, message, convo_id, files } = values;
      try {
        const { data } = await axios.post(
          MESSAGE_ENDPOINT,
          {
            message,
            convo_id,
            files,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return data;
      } catch (error) {
        return rejectWithValue(error.response.data.error.message);
      }
    }
  );

  export const createGroupConversation = createAsyncThunk(
    "conervsation/create_group",
    async (values, { rejectWithValue }) => {
      const { token, name, users } = values;
      try {
        const { data } = await axios.post(
          `${CONVERSATION_ENDPOINT}/group`,
          { name, users },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return data;
      } catch (error) {
        return rejectWithValue(error.response.data.error.message);
      }
    }
  );

  export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
      setActiveConversation: (state, action) => {
        state.activeConversation = action.payload;
      },
      updateMessagesAndConversations: (state, action) => {
        let convo = state.activeConversation;
        if (convo._id === action.payload.conversation._id) {
          state.messages = [...state.messages, action.payload];
        }
        let conversation = {
          ...action.payload.conversation,
          latestMessage: action.payload,
        };
        let newConvos = [...state.conversations].filter(
          (c) => c._id !== conversation._id
        );
        newConvos.unshift(conversation);
        state.conversations = newConvos;
      },
      addFiles: (state, action) => {
        state.files = [...state.files, action.payload];
      },
      clearFiles: (state) => {
        state.files = [];
      },
      removeFileFromFiles: (state, action) => {
        let index = action.payload;
        let files = [...state.files];
        let fileToRemove = [files[index]];
        state.files = files.filter((file) => !fileToRemove.includes(file));
      },

      addConversation: (state, action) => {
      const exists = state.conversations.find(
        (c) => c._id === action.payload._id
      );

      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },
    
    },
    extraReducers(builder) {
      builder
        .addCase(getConversations.pending, (state) => {
          state.status = "loading";
        })
        .addCase(getConversations.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.conversations = action.payload;
        })
        .addCase(getConversations.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })

        .addCase(open_create_conversation.pending, (state) => {
          state.status = "loading";
        })
        .addCase(open_create_conversation.fulfilled, (state, action) => {
          state.status = "succeeded";
          //added
          state.activeConversation = action.payload;
          state.files = [];

          const exists = state.conversations.find(
          (c) => c._id === action.payload._id
        );

        })
        .addCase(open_create_conversation.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })

        .addCase(getConversationMessages.pending, (state) => {
          state.status = "loading";
        })
        .addCase(getConversationMessages.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.messages = action.payload;
        })
        .addCase(getConversationMessages.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })

        .addCase(sendMessage.pending, (state) => {
          state.status = "loading";
        })
        .addCase(sendMessage.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.messages = [...state.messages, action.payload];

          let conversation = {
            ...action.payload.conversation,
            latestMessage: action.payload,
          };

          let newConvos = [...state.conversations].filter(
            (c) => c._id !== conversation._id
          );
          newConvos.unshift(conversation);
          state.conversations = newConvos;
          state.files = [];
        })
        .addCase(sendMessage.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })

        // ✅🔥 THIS IS THE MISSING PART (GROUP CREATION)
        .addCase(createGroupConversation.pending, (state) => {
          state.status = "loading";
        })
        .addCase(createGroupConversation.fulfilled, (state, action) => {
          state.status = "succeeded";

          state.activeConversation = action.payload;
          state.files = [];

          // add new group to top
          state.conversations = [action.payload, ...state.conversations];

          // optional: open the group immediately
          state.activeConversation = action.payload;
        })
        .addCase(createGroupConversation.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        });
    },
  });

  export const {
    setActiveConversation,
    updateMessagesAndConversations,
    addFiles,
    clearFiles,
    removeFileFromFiles,
    addConversation,
  } = chatSlice.actions;

  export default chatSlice.reducer;