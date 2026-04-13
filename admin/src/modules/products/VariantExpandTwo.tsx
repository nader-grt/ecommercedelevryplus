import {
    useRecordContext,
    useNotify,
    useRefresh,
  } from "react-admin";
  import { useState } from "react";
  import axios from "axios";
  
  const VariantExpandTwo = () => {
    const record = useRecordContext<any>();
    const notify = useNotify();
    const refresh = useRefresh();
  
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<any>({});
  
    if (!record) return null;
  
    const variants = record.variants || [];
  
    // =========================
    // 🔹 DELETE
    // =========================
    const handleDelete = async (id: number) => {
      try {

        console.log(" idddddddd  consoleidddd ",id)
        await axios.delete(
          `http://localhost:4000/api/variants/${id}`,
          { withCredentials: true }
        );
        notify("Variant deleted", { type: "success" });
        refresh();
      } catch (e: any) {
        notify(e.message, { type: "error" });
      }
    };
  
    // =========================
    // 🔹 EDIT START
    // =========================
    const startEdit = (v: any) => {
      setEditingId(v.id);
      setForm(v);
    };
  
    // =========================
    // 🔹 SAVE EDIT
    // =========================
    const handleSave = async () => {
      try {
        await axios.put(
          `http://localhost:4000/api/variants/${editingId}`,
          form,
          { withCredentials: true }
        );
  
        notify("Variant updated", { type: "success" });
        setEditingId(null);
        refresh();
      } catch (e: any) {
        notify(e.message, { type: "error" });
      }
    };
  
    return (
      <div style={{ padding: 20 }}>
        <h3>Variants</h3>
  
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#111",
            color: "#fff",
          }}
        >
          <thead>
            <tr>
              <th>SKU</th>
              <th>Color</th>
              <th>Size</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
  
          <tbody>
            {variants.map((v: any) => (
              <tr key={v.id}>
                {/* SKU */}
                <td>
                  {editingId === v.id ? (
                    <input
                      value={form.sku || ""}
                      onChange={(e) =>
                        setForm({ ...form, sku: e.target.value })
                      }
                    />
                  ) : (
                    v.sku
                  )}
                </td>
  
                {/* COLOR */}
                <td>
                  {editingId === v.id ? (
                    <input
                      value={form.color || ""}
                      onChange={(e) =>
                        setForm({ ...form, color: e.target.value })
                      }
                    />
                  ) : (
                    v.color
                  )}
                </td>
  
                {/* SIZE */}
                <td>
                  {editingId === v.id ? (
                    <input
                      value={form.size || ""}
                      onChange={(e) =>
                        setForm({ ...form, size: e.target.value })
                      }
                    />
                  ) : (
                    v.size
                  )}
                </td>
  
                {/* PRICE */}
                <td>
                  {editingId === v.id ? (
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    `${v.price} TND`
                  )}
                </td>
  
                {/* ACTIONS */}
                <td>
                  {editingId === v.id ? (
                    <>
                      <button onClick={handleSave}>💾 Save</button>
                      <button onClick={() => setEditingId(null)}>
                        ❌ Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(v)}>
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                      >
                        🗑 Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {variants.length === 0 && <p>No variants</p>}
      </div>
    );
  };
  
  export default VariantExpandTwo;