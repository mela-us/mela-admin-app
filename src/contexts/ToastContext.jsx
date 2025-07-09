import { createContext, useCallback, useContext, useReducer } from 'react';

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 2300;

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.payload, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.payload || action.payload === undefined ? { ...toast, open: false } : toast,
        ),
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: action.payload === undefined ? [] : state.toasts.filter((toast) => toast.id !== action.payload),
      };
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((toast) => (toast.id === action.payload.id ? { ...toast, ...action.payload } : toast)),
      };
    default:
      return state;
  }
};

const ToastContext = createContext();

let count = 0;
const toastTimeouts = new Map();

const generateId = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
};

const addToRemoveQueue = (toastId, dispatch) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: 'REMOVE_TOAST', payload: toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: [],
  });

  const showToast = useCallback(({ title, description, variant = 'info', action }) => {
    const id = generateId();

    const toast = {
      id,
      title,
      description,
      variant,
      action,
      open: true,
    };

    dispatch({ type: 'ADD_TOAST', payload: toast });

    // Tự động dismiss sau 2300ms
    const timeout = setTimeout(() => {
      dispatch({ type: 'DISMISS_TOAST', payload: id });
      addToRemoveQueue(id, dispatch);
    }, TOAST_REMOVE_DELAY);

    return {
      id,
      dismiss: () => {
        clearTimeout(timeout);
        dispatch({ type: 'DISMISS_TOAST', payload: id });
        addToRemoveQueue(id, dispatch);
      },
      update: (props) => {
        dispatch({
          type: 'UPDATE_TOAST',
          payload: { ...props, id },
        });
      },
    };
  }, []);

  const dismissToast = useCallback(
    (toastId) => {
      dispatch({ type: 'DISMISS_TOAST', payload: toastId });

      if (toastId) {
        addToRemoveQueue(toastId, dispatch);
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id, dispatch));
      }
    },
    [state.toasts],
  );

  // Convenience methods for different toast types
  const toastSuccess = useCallback((props) => showToast({ ...props, variant: 'success' }), [showToast]);
  const toastError = useCallback((props) => showToast({ ...props, variant: 'error' }), [showToast]);
  const toastWarning = useCallback((props) => showToast({ ...props, variant: 'warning' }), [showToast]);
  const toastInfo = useCallback((props) => showToast({ ...props, variant: 'info' }), [showToast]);

  const toast = {
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
    info: toastInfo,
  };

  const value = {
    toasts: state.toasts,
    showToast,
    dismissToast,
    toast,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
