import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  sidebarOpen: false,
  modalOpen: false,
  modalType: null,
  modalProps: {},
  toast: {
    show: false,
    message: '',
    type: 'info',
  },
  isLoading: false,
  progress: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      state.modalOpen = true;
      state.modalType = action.payload.type;
      state.modalProps = action.payload.props || {};
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalType = null;
      state.modalProps = {};
    },
    showToast: (state, action) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  showToast,
  hideToast,
  setLoading,
  setProgress,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;