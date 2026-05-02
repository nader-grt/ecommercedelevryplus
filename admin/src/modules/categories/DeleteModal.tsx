import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

const DeleteModal = ({ open, onClose, result, onConfirm }: any) => {
  if (!open || !result) return null;

  const renderContent = () => {
    switch (result.status) {
      case "PENDING":
        return (
          <div>
            <h3>⚠️ Confirm Delete</h3>
            <p>Are you sure you want to delete this category?</p>
          </div>
        );

      case "DELETED":
        return (
          <div>
            <h3> Deleted successfully</h3>
            <p>{result.message}</p>
          </div>
        );

      case "HAS_PRODUCTS":
        return (
          <div>
            <h3>⚠️ Cannot delete</h3>
            <p>{result.message}</p>
            <p>Products count: {result.data?.count}</p>
          </div>
        );

      case "HAS_ORDERS":
        return (
          <div>
            <h3>🚫 Blocked</h3>
            <p>{result.message}</p>
          </div>
        );

      case "NOT_FOUND":
        return (
          <div>
            <h3>❌ Not found</h3>
            <p>{result.message}</p>
          </div>
        );

      case "ERROR":
        return (
          <div>
            <h3> Error</h3>
            <p>{result.message}</p>
          </div>
        );

      default:
        return <p>Unknown response</p>;
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Category</DialogTitle>
  
      <DialogContent>
        {renderContent()}
  
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          {result.status === "PENDING" ? (
            <>
              <Button
                variant="contained"
                color="error"
                onClick={onConfirm}
              >
                Delete
              </Button>
  
              <Button onClick={onClose}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;