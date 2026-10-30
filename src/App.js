import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "autocare_pro_records_v1";
const USERS_KEY = "autocare_pro_users_v1";
const SESSION_KEY = "autocare_pro_session_v1";

// Demo-only local account. In production, authenticate through a backend API.
const DEFAULT_ADMIN = {
  id: "admin-default",
  name: "System Administrator",
  email: "admin@autocarepro.com",
  password: "Admin@123",
  role: "admin",
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const dateString = (date) => {
  const d = new Date(date);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const today = () => dateString(new Date());

const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return dateString(d);
};

const seedRecords = [
  {
    id: 1001,
    customer: "Arun Kumar",
    phone: "9876543210",
    email: "arun@example.com",
    vehicleNo: "TN 37 AB 1234",
    make: "Hyundai",
    model: "Creta",
    year: "2022",
    mileage: "28500",
    serviceType: "Full Service",
    appointment: today(),
    nextService: addDays(30),
    status: "In Progress",
    mechanic: "Karthik",
    amount: 6500,
    amountPaid: 0,
    payment: "Unpaid",
    notes: "Engine oil and general inspection",
  },
  {
    id: 1002,
    customer: "Priya S",
    phone: "9840012345",
    email: "priya@example.com",
    vehicleNo: "TN 38 CD 5678",
    make: "Honda",
    model: "City",
    year: "2021",
    mileage: "41200",
    serviceType: "Oil Change",
    appointment: addDays(-1),
    nextService: addDays(90),
    status: "Completed",
    mechanic: "Manoj",
    amount: 2800,
    amountPaid: 2800,
    payment: "Paid",
    notes: "Oil and filter replaced",
  },
  {
    id: 1003,
    customer: "Mohammed Iqbal",
    phone: "9791012345",
    email: "iqbal@example.com",
    vehicleNo: "TN 39 EF 9012",
    make: "Tata",
    model: "Nexon",
    year: "2023",
    mileage: "16300",
    serviceType: "Brake Service",
    appointment: addDays(1),
    nextService: addDays(60),
    status: "Pending",
    mechanic: "Unassigned",
    amount: 4200,
    amountPaid: 0,
    payment: "Unpaid",
    notes: "Check brake pads and discs",
  },
  {
    id: 1004,
    customer: "Divya R",
    phone: "9884412345",
    email: "divya@example.com",
    vehicleNo: "TN 40 GH 3456",
    make: "Maruti Suzuki",
    model: "Baleno",
    year: "2020",
    mileage: "55000",
    serviceType: "AC Repair",
    appointment: addDays(-3),
    nextService: addDays(-2),
    status: "Delivered",
    mechanic: "Karthik",
    amount: 5200,
    amountPaid: 5200,
    payment: "Paid",
    notes: "AC cooling checked",
  },
  {
    id: 1005,
    customer: "Suresh Babu",
    phone: "9952012345",
    email: "suresh@example.com",
    vehicleNo: "TN 41 JK 7890",
    make: "Toyota",
    model: "Innova",
    year: "2019",
    mileage: "78000",
    serviceType: "General Repair",
    appointment: addDays(2),
    nextService: addDays(45),
    status: "Pending",
    mechanic: "Manoj",
    amount: 8900,
    amountPaid: 4450,
    payment: "Partial",
    notes: "Suspension inspection",
  },
];

const emptyForm = {
  customer: "",
  phone: "",
  email: "",
  vehicleNo: "",
  make: "",
  model: "",
  year: "",
  mileage: "",
  serviceType: "Full Service",
  appointment: today(),
  nextService: "",
  status: "Pending",
  mechanic: "Unassigned",
  amount: "",
  amountPaid: "0",
  payment: "Unpaid",
  notes: "",
};

const navItems = [
  { id: "overview", icon: "▦", label: "Overview" },
  { id: "vehicles", icon: "▣", label: "Customers & vehicles" },
  { id: "appointments", icon: "◷", label: "Appointments" },
  { id: "billing", icon: "▤", label: "Billing & payments" },
  { id: "reports", icon: "▥", label: "Reports" },
];

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#f4f7fb",
    color: "#172033",
    fontFamily: "Inter, system-ui, Arial, sans-serif",
  },
  sidebar: {
    width: 245,
    flexShrink: 0,
    background: "#111c32",
    color: "#fff",
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  brand: {
    fontSize: 21,
    fontWeight: 800,
    padding: "10px 4px 26px",
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "12px 13px",
    border: 0,
    borderRadius: 10,
    color: "#cbd5e1",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
    fontSize: 14,
  },
  navActive: {
    background: "#263a5d",
    color: "#fff",
  },
  main: {
    minWidth: 0,
    flex: 1,
    padding: "28px clamp(16px, 3vw, 40px)",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 25,
  },
  title: {
    margin: 0,
    fontSize: 27,
    letterSpacing: "-.6px",
  },
  muted: {
    color: "#718096",
    fontSize: 13,
    marginTop: 6,
  },
  button: {
    background: "#2563eb",
    color: "#fff",
    border: 0,
    borderRadius: 9,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  buttonSecondary: {
    background: "#e7edf7",
    color: "#24334d",
    border: 0,
    borderRadius: 9,
    padding: "9px 12px",
    cursor: "pointer",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    marginBottom: 22,
  },
  card: {
    background: "#fff",
    border: "1px solid #e5eaf2",
    borderRadius: 15,
    padding: 19,
    boxShadow: "0 3px 14px rgba(20,35,60,.035)",
  },
  metricLabel: {
    color: "#718096",
    fontSize: 13,
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 27,
    fontWeight: 800,
    letterSpacing: "-.5px",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 750,
    margin: "0 0 15px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d7dfeb",
    borderRadius: 8,
    padding: "10px 11px",
    background: "#fff",
    color: "#172033",
    font: "inherit",
    fontSize: 14,
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#5d6b82",
    fontWeight: 700,
    marginBottom: 6,
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
    minWidth: 760,
  },
  th: {
    textAlign: "left",
    color: "#738097",
    background: "#f8fafc",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: ".5px",
    padding: "12px 13px",
    borderBottom: "1px solid #e7edf5",
  },
  td: {
    padding: "13px",
    borderBottom: "1px solid #edf1f6",
    verticalAlign: "middle",
  },
  pill: {
    display: "inline-block",
    borderRadius: 30,
    padding: "4px 9px",
    fontSize: 11,
    fontWeight: 750,
    background: "#edf2f8",
    color: "#42526b",
    whiteSpace: "nowrap",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 14,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(10,20,40,.55)",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    width: "min(850px, 100%)",
    maxHeight: "92vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxSizing: "border-box",
  },
};

function StatusPill({ status }) {
  const palette = {
    Pending: { background: "#fff3d8", color: "#925f00" },
    "In Progress": { background: "#dbeafe", color: "#1d4ed8" },
    Completed: { background: "#dcfce7", color: "#166534" },
    Delivered: { background: "#d1fae5", color: "#065f46" },
    Paid: { background: "#dcfce7", color: "#166534" },
    Unpaid: { background: "#fee2e2", color: "#991b1b" },
    Partial: { background: "#fef3c7", color: "#92400e" },
  };

  return (
    <span style={{ ...styles.pill, ...(palette[status] || {}) }}>
      {status || "—"}
    </span>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  options,
}) {
  return (
    <label>
      <span style={styles.label}>
        {label}
        {required ? " *" : ""}
      </span>

      {options ? (
        <select
          style={styles.input}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          required={required}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          style={styles.input}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          required={required}
        />
      )}
    </label>
  );
}

function App() {
  const [users, setUsers] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const list = Array.isArray(saved) ? saved : [];
      return list.some((user) => user.role === "admin")
        ? list
        : [DEFAULT_ADMIN, ...list];
    } catch {
      return [DEFAULT_ADMIN];
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!session?.id) return null;
      const savedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const list = Array.isArray(savedUsers) ? savedUsers : [];
      const availableUsers = list.some((user) => user.role === "admin")
        ? list
        : [DEFAULT_ADMIN, ...list];
      return availableUsers.find((user) => user.id === session.id) || null;
    } catch {
      return null;
    }
  });
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [authError, setAuthError] = useState("");
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return seedRecords;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : seedRecords;
    } catch {
      return seedRecords;
    }
  });

  const visibleRecords =
    currentUser?.role === "admin"
      ? records
      : records.filter((record) => record.createdBy === currentUser?.id);

  const [activePage, setActivePage] = useState("overview");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [paymentFilter, setPaymentFilter] = useState("All payments");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");
  const [dark, setDark] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const pageSize = 7;

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Unable to save accounts", error);
    }
  }, [users]);

  function handleAuthChange(event) {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
    setAuthError("");
  }

  function handleAuthSubmit(event) {
    event.preventDefault();
    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password;
    if (!email || !password) {
      setAuthError("Enter your email address and password.");
      return;
    }

    if (authMode === "register") {
      const name = authForm.name.trim();
      if (!name) {
        setAuthError("Enter your full name.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setAuthError("Enter a valid email address.");
        return;
      }
      if (password.length < 8) {
        setAuthError("Password must contain at least 8 characters.");
        return;
      }
      if (password !== authForm.confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }
      if (users.some((user) => user.email.toLowerCase() === email)) {
        setAuthError("An account with this email already exists.");
        return;
      }
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        role: "user",
        createdAt: new Date().toISOString(),
      };
      setUsers((current) => [...current, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: newUser.id }));
      setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });
      setAuthError("");
      setToast("Account created successfully.");
      return;
    }

    const account = users.find(
      (user) =>
        user.email.toLowerCase() === email && user.password === password,
    );
    if (!account) {
      setAuthError("Invalid email or password.");
      return;
    }
    setCurrentUser(account);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: account.id }));
    setAuthError("");
    setToast(`Welcome back, ${account.name}.`);
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setAuthMode("login");
    setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });
    setAuthError("");
    setActivePage("overview");
  }
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error("Unable to save records to localStorage", error);
    }
  }, [records]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const stats = useMemo(() => {
    const total = new Set(
      visibleRecords
        .map((r) => (r.vehicleNo || "").trim().toUpperCase())
        .filter(Boolean),
    ).size;

    const active = visibleRecords.filter((r) =>
      ["Pending", "In Progress"].includes(r.status),
    ).length;

    const completed = visibleRecords.filter((r) =>
      ["Completed", "Delivered"].includes(r.status),
    ).length;

    const revenue = visibleRecords.reduce(
      (sum, r) =>
        sum +
        Math.max(
          0,
          Number(
            r.amountPaid ??
              (r.payment === "Paid"
                ? r.amount
                : r.payment === "Partial"
                  ? Number(r.amount || 0) / 2
                  : 0),
          ) || 0,
        ),
      0,
    );

    const outstanding = visibleRecords.reduce((sum, r) => {
      const amount = Math.max(0, Number(r.amount || 0));
      const paid = Math.min(
        amount,
        Math.max(
          0,
          Number(
            r.amountPaid ??
              (r.payment === "Paid"
                ? amount
                : r.payment === "Partial"
                  ? amount / 2
                  : 0),
          ) || 0,
        ),
      );

      return sum + Math.max(0, amount - paid);
    }, 0);

    return {
      total,
      active,
      completed,
      revenue,
      outstanding,
      jobs: visibleRecords.length,
    };
  }, [visibleRecords]);

  const filtered = useMemo(() => {
    let data = visibleRecords.filter((r) => {
      const searchable = [
        r.customer,
        r.phone,
        r.email,
        r.vehicleNo,
        r.make,
        r.model,
        r.serviceType,
        r.mechanic,
      ]
        .join(" ")
        .toLowerCase();

      const matchesDate =
        (!dateFrom || r.appointment >= dateFrom) &&
        (!dateTo || r.appointment <= dateTo);

      const matchesPage =
        activePage !== "appointments" || r.appointment >= today();

      return (
        searchable.includes(query.toLowerCase()) &&
        (statusFilter === "All statuses" || r.status === statusFilter) &&
        (paymentFilter === "All payments" || r.payment === paymentFilter) &&
        matchesDate &&
        matchesPage
      );
    });

    data = [...data].sort((a, b) => {
      if (sortBy === "oldest") return Number(a.id) - Number(b.id);
      if (sortBy === "appointment") {
        return (a.appointment || "").localeCompare(b.appointment || "");
      }
      return Number(b.id) - Number(a.id);
    });

    return data;
  }, [
    visibleRecords,
    query,
    statusFilter,
    paymentFilter,
    sortBy,
    activePage,
    dateFrom,
    dateTo,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    query,
    statusFilter,
    paymentFilter,
    activePage,
    sortBy,
    dateFrom,
    dateTo,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const upcoming = [...visibleRecords]
    .filter((r) => r.nextService && r.nextService >= today())
    .sort((a, b) => a.nextService.localeCompare(b.nextService))
    .slice(0, 4);

  const overdue = visibleRecords
    .filter((r) => r.nextService && r.nextService < today())
    .sort((a, b) => a.nextService.localeCompare(b.nextService));

  const pageTitle =
    navItems.find((item) => item.id === activePage)?.label || "Overview";

  const heading =
    activePage === "overview"
      ? `Good day, ${currentUser?.name || "there"} 👋`
      : pageTitle;

  const subheading =
    activePage === "overview"
      ? "Here’s what’s happening at your service centre today."
      : "Manage your workshop operations in one place.";

  function openNew() {
    setEditingId(null);
    setForm({ ...emptyForm, appointment: today() });
    setModalOpen(true);
  }

  function openEdit(record) {
    setEditingId(record.id);
    setForm({
      ...emptyForm,
      ...record,
      amount: String(record.amount ?? ""),
      amountPaid: String(
        record.amountPaid ??
          (record.payment === "Paid"
            ? record.amount
            : record.payment === "Partial"
              ? Number(record.amount || 0) / 2
              : 0),
      ),
    });
    setModalOpen(true);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function saveRecord(event) {
    event.preventDefault();

    const amount = Math.max(0, Number(form.amount || 0));
    const amountPaid = Math.min(
      amount,
      Math.max(0, Number(form.amountPaid || 0)),
    );

    const payment =
      amountPaid <= 0 ? "Unpaid" : amountPaid >= amount ? "Paid" : "Partial";

    const record = {
      ...form,
      id: editingId || Date.now(),
      amount,
      amountPaid,
      payment,
      createdBy: editingId
        ? records.find((item) => item.id === editingId)?.createdBy ||
          currentUser?.id
        : currentUser?.id,
      updatedAt: new Date().toISOString(),
    };

    if (
      !form.customer.trim() ||
      !form.phone.trim() ||
      !form.vehicleNo.trim() ||
      !form.make.trim() ||
      !form.model.trim()
    ) {
      setToast("Please fill all required fields.");
      return;
    }

    if (!/^[0-9+\-\s()]{7,16}$/.test(form.phone.trim())) {
      setToast("Enter a valid phone number.");
      return;
    }

    if (editingId) {
      setRecords((current) =>
        current.map((item) => (item.id === editingId ? record : item)),
      );
      setToast("Record updated successfully.");
    } else {
      setRecords((current) => [record, ...current]);
      setToast("New service record added.");

      // Open WhatsApp only for a newly added record.
      // The record is still saved even if no next-service date is entered.
      if (record.nextService) {
        sendWhatsAppReminder(record);
      }
    }

    setModalOpen(false);
  }

  function deleteRecord(id) {
    if (currentUser?.role !== "admin") {
      setToast("Only administrators can delete service records.");
      return;
    }

    const record = records.find((item) => item.id === id);

    if (
      window.confirm(
        `Delete the service record for ${
          record?.customer || "this customer"
        }? This cannot be undone.`,
      )
    ) {
      setRecords((current) => current.filter((item) => item.id !== id));
      setToast("Record deleted.");
      if (viewRecord?.id === id) setViewRecord(null);
    }
  }

  function exportCSV() {
    const columns = [
      "customer",
      "phone",
      "email",
      "vehicleNo",
      "make",
      "model",
      "year",
      "mileage",
      "serviceType",
      "appointment",
      "nextService",
      "status",
      "mechanic",
      "amount",
      "amountPaid",
      "payment",
      "notes",
    ];

    const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      columns.join(","),
      ...filtered.map((r) =>
        columns.map((column) => quote(r[column])).join(","),
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `autocare-records-${today()}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setToast("CSV export downloaded.");
  }

  function exportBackup() {
    const backup = {
      app: "AutoCare Pro",
      version: 1,
      exportedAt: new Date().toISOString(),
      records: visibleRecords,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `autocare-backup-${today()}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setToast("JSON backup downloaded.");
  }

  async function importBackup(event) {
    if (currentUser?.role !== "admin") {
      event.target.value = "";
      setToast("Only administrators can restore a backup.");
      return;
    }

    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      const imported = Array.isArray(parsed) ? parsed : parsed.records;

      if (
        !Array.isArray(imported) ||
        imported.some((item) => !item || typeof item !== "object" || !item.id)
      ) {
        throw new Error("Invalid backup format");
      }

      if (
        !window.confirm(
          `Import ${imported.length} records? This replaces the records currently saved in this browser.`,
        )
      ) {
        return;
      }

      setRecords(imported);
      setToast(`${imported.length} records imported successfully.`);
    } catch {
      setToast(
        "Could not import this file. Please choose a valid AutoCare Pro JSON backup.",
      );
    }
  }

  function printInvoice(record) {
    if (!record) return;

    const safe = (value) =>
      String(value ?? "—").replace(
        /[&<>"']/g,
        (character) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[character],
      );

    const amount = Math.max(0, Number(record.amount || 0));
    const paid = Math.min(amount, Math.max(0, Number(record.amountPaid || 0)));

    const printWindow = window.open("", "_blank", "width=800,height=700");

    if (!printWindow) {
      setToast("Please allow pop-ups to print the invoice.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Invoice - ${safe(record.vehicleNo)}</title>
          <meta charset="utf-8">
          <style>
            body {
              font: 14px Arial, sans-serif;
              color: #172033;
              padding: 36px;
              max-width: 760px;
              margin: auto;
            }
            header {
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 18px;
              margin-bottom: 24px;
            }
            h1 { margin: 0 0 6px; font-size: 26px; }
            h2 { font-size: 16px; margin-top: 28px; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
            }
            td, th {
              padding: 12px;
              border-bottom: 1px solid #dbe3ef;
              text-align: left;
            }
            .right { text-align: right; }
            .total { font-size: 18px; font-weight: bold; }
            .muted { color: #64748b; }
            .note { margin-top: 28px; white-space: pre-wrap; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <header>
            <div>
              <h1>AutoCare Pro</h1>
              <div class="muted">Vehicle Service Invoice</div>
            </div>
            <div class="right">
              <strong>Invoice #${safe(record.id)}</strong>
              <div class="muted">Date: ${safe(record.appointment)}</div>
            </div>
          </header>

          <h2>Customer & Vehicle</h2>
          <p>
            <strong>${safe(record.customer)}</strong><br>
            Phone: ${safe(record.phone)}<br>
            Email: ${safe(record.email)}<br>
            Vehicle: ${safe(record.vehicleNo)} ·
            ${safe(record.make)} ${safe(record.model)}
            (${safe(record.year)})<br>
            Mechanic: ${safe(record.mechanic)}
          </p>

          <h2>Service details</h2>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Job status</th>
                <th class="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  ${safe(record.serviceType)}<br>
                  <span class="muted">${safe(record.notes)}</span>
                </td>
                <td>${safe(record.status)}</td>
                <td class="right">${safe(money(amount))}</td>
              </tr>
            </tbody>
          </table>

          <table>
            <tbody>
              <tr>
                <td>Amount paid</td>
                <td class="right">${safe(money(paid))}</td>
              </tr>
              <tr class="total">
                <td>Balance due</td>
                <td class="right">${safe(money(amount - paid))}</td>
              </tr>
            </tbody>
          </table>

          <p class="note muted">
            Thank you for choosing AutoCare Pro.
          </p>

          <script>
            window.onload = () => { window.print(); };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  function sendWhatsAppReminder(record) {
    if (!record) return;

    // WhatsApp requires the full international number without +, spaces, or symbols.
    let phone = String(record.phone || "").replace(/\D/g, "");

    // Default Indian local numbers to country code 91.
    if (phone.startsWith("0") && phone.length === 11) {
      phone = phone.slice(1);
    }
    if (phone.length === 10) {
      phone = `91${phone}`;
    }

    if (!phone || phone.length < 10) {
      setToast("Enter a valid customer phone number before opening WhatsApp.");
      return;
    }

    if (!record.nextService) {
      setToast(
        "Record saved, but add a Next Service Date to prepare a reminder.",
      );
      return;
    }

    const customerName = record.customer || "Customer";
    const vehicleNo = record.vehicleNo || "your vehicle";
    const vehicleName =
      [record.make, record.model].filter(Boolean).join(" ") || "vehicle";
    const serviceType = record.serviceType || "vehicle service";

    const serviceDate = new Date(
      `${record.nextService}T00:00:00`,
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const message =
      `Hello ${customerName}! 👋\n\n` +
      `This is a friendly service reminder from AutoCare Pro. 🚗\n\n` +
      `Vehicle: ${vehicleName}\n` +
      `Vehicle Number: ${vehicleNo}\n` +
      `Service: ${serviceType}\n` +
      `Next Service Date: ${serviceDate}\n\n` +
      `Please contact us to confirm your service appointment.\n\n` +
      `Thank you for choosing AutoCare Pro!`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Opens WhatsApp with the message pre-filled. The user must click Send.
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  function resetDemo() {
    if (currentUser?.role !== "admin") {
      setToast("Only administrators can restore sample data.");
      return;
    }

    if (
      window.confirm(
        "Restore the sample records? Your current local records will be replaced.",
      )
    ) {
      setRecords(seedRecords);
      setToast("Sample data restored.");
    }
  }

  const isDark = dark;

  const appStyle = {
    ...styles.app,
    background: isDark ? "#0b1220" : "#f4f7fb",
    color: isDark ? "#e5edf8" : "#172033",
  };

  const cardStyle = {
    ...styles.card,
    background: isDark ? "#141f31" : "#fff",
    borderColor: isDark ? "#29364a" : "#e5eaf2",
    color: isDark ? "#e5edf8" : "#172033",
  };

  const tableStyle = { ...styles.table };

  const contentCard = (children, extra = {}) => (
    <section style={{ ...cardStyle, ...extra }}>{children}</section>
  );

  function RecordTable({ rows }) {
    if (!rows.length) {
      return (
        <div
          style={{
            padding: 28,
            textAlign: "center",
            color: "#718096",
          }}
        >
          No records found. Try changing the filters or add a service record.
        </div>
      );
    }

    return (
      <div style={styles.tableWrap}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {[
                "Customer / vehicle",
                "Service",
                "Appointment",
                "Mechanic",
                "Job status",
                "Invoice",
                "Payment",
                "Actions",
              ].map((headingText) => (
                <th style={styles.th} key={headingText}>
                  {headingText}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={styles.td}>
                  <strong>{r.customer}</strong>
                  <div style={{ color: "#718096", marginTop: 4 }}>
                    {r.vehicleNo} · {r.make} {r.model}
                  </div>
                </td>
                <td style={styles.td}>{r.serviceType}</td>
                <td style={styles.td}>{r.appointment || "—"}</td>
                <td style={styles.td}>{r.mechanic || "Unassigned"}</td>
                <td style={styles.td}>
                  <StatusPill status={r.status} />
                </td>
                <td style={styles.td}>{money(r.amount)}</td>
                <td style={styles.td}>
                  <StatusPill status={r.payment} />
                </td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      style={styles.buttonSecondary}
                      onClick={() => setViewRecord(r)}
                      title="View record"
                    >
                      View
                    </button>
                    <button
                      style={styles.buttonSecondary}
                      onClick={() => openEdit(r)}
                      title="Edit record"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (!currentUser) {
    const isRegister = authMode === "register";
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          background:
            "linear-gradient(135deg, #0b1220 0%, #14243d 55%, #1e3a5f 100%)",
          fontFamily: "Inter, Segoe UI, Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            background: "#fff",
            color: "#172033",
            borderRadius: 22,
            padding: "34px 32px",
            boxShadow: "0 24px 70px #0005",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "#2563eb",
              letterSpacing: 1.2,
            }}
          >
            🔧 AUTOCARE PRO
          </div>

          <h1
            style={{
              fontSize: 28,
              margin: "22px 0 8px",
              color: "#111827",
            }}
          >
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: 14,
              lineHeight: 1.6,
              marginTop: 0,
            }}
          >
            {isRegister
              ? "Register a workshop user account to manage service records."
              : "Sign in to your vehicle service management workspace."}
          </p>

          <form
            onSubmit={handleAuthSubmit}
            style={{ display: "grid", gap: 15, marginTop: 24 }}
          >
            {isRegister && (
              <label
                style={{
                  display: "grid",
                  gap: 7,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Full name
                <input
                  name="name"
                  autoComplete="name"
                  value={authForm.name}
                  onChange={handleAuthChange}
                  placeholder="Your full name"
                  required
                  style={{
                    padding: "12px 13px",
                    border: "1px solid #dbe3ef",
                    borderRadius: 10,
                    fontSize: 14,
                  }}
                />
              </label>
            )}

            <label
              style={{
                display: "grid",
                gap: 7,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={authForm.email}
                onChange={handleAuthChange}
                placeholder="you@example.com"
                required
                style={{
                  padding: "12px 13px",
                  border: "1px solid #dbe3ef",
                  borderRadius: 10,
                  fontSize: 14,
                }}
              />
            </label>

            <label
              style={{
                display: "grid",
                gap: 7,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Password
              <input
                name="password"
                type="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={authForm.password}
                onChange={handleAuthChange}
                placeholder={
                  isRegister ? "At least 8 characters" : "Enter your password"
                }
                minLength={isRegister ? 8 : undefined}
                required
                style={{
                  padding: "12px 13px",
                  border: "1px solid #dbe3ef",
                  borderRadius: 10,
                  fontSize: 14,
                }}
              />
            </label>

            {isRegister && (
              <label
                style={{
                  display: "grid",
                  gap: 7,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Confirm password
                <input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={authForm.confirmPassword}
                  onChange={handleAuthChange}
                  placeholder="Re-enter password"
                  required
                  style={{
                    padding: "12px 13px",
                    border: "1px solid #dbe3ef",
                    borderRadius: 10,
                    fontSize: 14,
                  }}
                />
              </label>
            )}

            {authError && (
              <div
                role="alert"
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding: 11,
                  borderRadius: 9,
                  fontSize: 13,
                }}
              >
                {authError}
              </div>
            )}

            <button
              type="submit"
              style={{
                border: 0,
                borderRadius: 10,
                padding: 13,
                background: "#2563eb",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                marginTop: 3,
              }}
            >
              {isRegister ? "Create account" : "Sign in"}
            </button>
          </form>

          {!isRegister && (
            <div
              style={{
                background: "#eff6ff",
                color: "#1e40af",
                padding: 12,
                borderRadius: 10,
                fontSize: 12,
                lineHeight: 1.7,
                marginTop: 18,
              }}
            >
              <strong>Demo administrator</strong>
              <br />
              Email: admin@autocarepro.com
              <br />
              Password: Admin@123
            </div>
          )}

          <p
            style={{
              textAlign: "center",
              color: "#64748b",
              fontSize: 13,
              margin: "22px 0 0",
            }}
          >
            {isRegister ? "Already registered? " : "New to AutoCare Pro? "}
            <button
              type="button"
              onClick={() => {
                setAuthMode(isRegister ? "login" : "register");
                setAuthError("");
              }}
              style={{
                border: 0,
                background: "transparent",
                color: "#2563eb",
                fontWeight: 800,
                cursor: "pointer",
                padding: 0,
              }}
            >
              {isRegister ? "Sign in" : "Create an account"}
            </button>
          </p>

          <p
            style={{
              color: "#94a3b8",
              textAlign: "center",
              fontSize: 11,
              lineHeight: 1.5,
              marginBottom: 0,
            }}
          >
            Demo authentication stores accounts in this browser only. Use a
            secure backend for production.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={appStyle}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          🔧 AutoCare <span style={{ color: "#60a5fa" }}>Pro</span>
          <div
            style={{
              fontSize: 9,
              letterSpacing: 2,
              color: "#9eacc2",
              marginTop: 5,
            }}
          >
            SERVICE MANAGEMENT
          </div>
        </div>

        <div
          style={{
            color: "#8190a8",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.5,
            padding: "4px 10px",
          }}
        >
          WORKSPACE
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            style={{
              ...styles.navButton,
              ...(activePage === item.id ? styles.navActive : {}),
            }}
            onClick={() => setActivePage(item.id)}
          >
            <span style={{ fontSize: 18, width: 20 }}>{item.icon}</span>
            <span>{item.label}</span>

            {item.id === "appointments" && (
              <span
                style={{
                  marginLeft: "auto",
                  background: "#3b82f6",
                  color: "white",
                  borderRadius: 20,
                  padding: "2px 7px",
                  fontSize: 11,
                }}
              >
                {
                  visibleRecords.filter(
                    (r) =>
                      r.appointment === today() && r.status !== "Delivered",
                  ).length
                }
              </span>
            )}
          </button>
        ))}

        <div style={{ flex: 1, minHeight: 40 }} />

        <div
          style={{
            margin: "8px 6px 12px",
            padding: 12,
            borderRadius: 12,
            background: "#1c2b43",
            color: "#e2e8f0",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800 }}>
            {currentUser.name}
          </div>
          <div style={{ fontSize: 11, color: "#a7b6cc", marginTop: 4 }}>
            {currentUser.email}
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: 8,
              borderRadius: 20,
              padding: "3px 8px",
              background: currentUser.role === "admin" ? "#1d4ed8" : "#334155",
              color: "#fff",
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            {currentUser.role}
          </div>
          <button
            type="button"
            onClick={logout}
            style={{
              ...styles.buttonSecondary,
              width: "100%",
              marginTop: 10,
              color: "#fff",
              background: "#334155",
              borderColor: "#475569",
            }}
          >
            ↪ Log out
          </button>
        </div>

        <div style={{ color: "#9eacc2", fontSize: 12, padding: 10 }}>
          Local workshop workspace
        </div>

        <button
          style={styles.navButton}
          onClick={() => setDark((value) => !value)}
        >
          {dark ? "☀️ Switch to light theme" : "🌙 Switch to dark theme"}
        </button>

        <button style={styles.navButton} onClick={resetDemo}>
          ↻ Restore demo data
        </button>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div>
            <h1 style={styles.title}>{heading}</h1>
            <div style={styles.muted}>{subheading}</div>
          </div>

          <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
            <button style={styles.buttonSecondary} onClick={exportCSV}>
              ⇩ Export CSV
            </button>

            <button style={styles.buttonSecondary} onClick={exportBackup}>
              ⬇ Backup JSON
            </button>

            <button
              style={styles.buttonSecondary}
              onClick={() =>
                document.getElementById("autocare-import-json")?.click()
              }
            >
              ⬆ Import backup
            </button>

            <input
              id="autocare-import-json"
              type="file"
              accept=".json,application/json"
              onChange={importBackup}
              style={{ display: "none" }}
            />

            <button style={styles.button} onClick={openNew}>
              ＋ Add service record
            </button>
          </div>
        </header>

        {activePage === "overview" && (
          <>
            <div style={styles.grid}>
              {[
                [
                  "Total vehicles",
                  stats.total,
                  "Unique registration numbers",
                  "🚘",
                ],
                [
                  "Active services",
                  stats.active,
                  "Pending or in progress",
                  "🛠️",
                ],
                [
                  "Completed jobs",
                  stats.completed,
                  "Completed or delivered",
                  "✓",
                ],
                [
                  "Revenue collected",
                  money(stats.revenue),
                  "Based on recorded payments",
                  "₹",
                ],
                [
                  "Outstanding balance",
                  money(stats.outstanding),
                  "Remaining invoice balance",
                  "◷",
                ],
              ].map(([label, value, detail, icon]) => (
                <div key={label} style={cardStyle}>
                  <div style={styles.row}>
                    <div style={styles.metricLabel}>{label}</div>
                    <span style={{ fontSize: 20 }}>{icon}</span>
                  </div>
                  <div style={styles.metricValue}>{value}</div>
                  <div style={{ ...styles.muted, marginTop: 8 }}>{detail}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 18,
                marginBottom: 20,
              }}
            >
              {contentCard(
                <>
                  <h2 style={styles.sectionTitle}>
                    Upcoming service reminders
                  </h2>

                  {upcoming.length ? (
                    upcoming.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          padding: "12px 0",
                          borderBottom: "1px solid #edf1f6",
                        }}
                      >
                        <div style={styles.row}>
                          <strong>{r.customer}</strong>
                          <StatusPill status={r.status} />
                        </div>
                        <div style={styles.muted}>
                          {r.vehicleNo} · {r.make} {r.model}
                        </div>
                        <div style={{ fontSize: 12, marginTop: 6 }}>
                          Next service: <strong>{r.nextService}</strong>
                        </div>
                        <button
                          style={{
                            ...styles.buttonSecondary,
                            marginTop: 8,
                          }}
                          onClick={() => sendWhatsAppReminder(r)}
                        >
                          WhatsApp reminder
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={styles.muted}>No upcoming reminders.</p>
                  )}
                </>,
                { marginBottom: 0 },
              )}

              {contentCard(
                <>
                  <h2 style={styles.sectionTitle}>
                    Overdue reminders{" "}
                    <StatusPill status={String(overdue.length)} />
                  </h2>

                  {overdue.length ? (
                    overdue.slice(0, 5).map((r) => (
                      <div
                        key={r.id}
                        style={{
                          padding: "12px 0",
                          borderBottom: "1px solid #edf1f6",
                        }}
                      >
                        <strong>{r.customer}</strong>
                        <div style={styles.muted}>
                          {r.vehicleNo} · Due {r.nextService}
                        </div>
                        <button
                          style={{
                            ...styles.buttonSecondary,
                            marginTop: 8,
                          }}
                          onClick={() => sendWhatsAppReminder(r)}
                        >
                          Send reminder
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={styles.muted}>
                      All service reminders are up to date.
                    </p>
                  )}
                </>,
                { marginBottom: 0 },
              )}
            </div>

            {contentCard(
              <>
                <div style={styles.row}>
                  <h2 style={styles.sectionTitle}>Recent service records</h2>
                  <button
                    style={styles.buttonSecondary}
                    onClick={() => setActivePage("vehicles")}
                  >
                    View all records →
                  </button>
                </div>

                <RecordTable
                  rows={[...visibleRecords]
                    .sort((a, b) => Number(b.id) - Number(a.id))
                    .slice(0, 5)}
                />
              </>,
            )}
          </>
        )}

        {activePage !== "overview" && (
          <>
            {activePage === "reports" && (
              <div style={{ ...styles.grid, marginBottom: 18 }}>
                <div style={cardStyle}>
                  <div style={styles.metricLabel}>Jobs in selected range</div>
                  <div style={styles.metricValue}>{filtered.length}</div>
                </div>

                <div style={cardStyle}>
                  <div style={styles.metricLabel}>
                    Collected in selected range
                  </div>
                  <div style={styles.metricValue}>
                    {money(
                      filtered.reduce(
                        (sum, r) =>
                          sum +
                          Number(
                            r.amountPaid ??
                              (r.payment === "Paid" ? r.amount : 0),
                          ),
                        0,
                      ),
                    )}
                  </div>
                </div>

                <div style={cardStyle}>
                  <div style={styles.metricLabel}>
                    Invoice value in selected range
                  </div>
                  <div style={styles.metricValue}>
                    {money(
                      filtered.reduce(
                        (sum, r) => sum + Number(r.amount || 0),
                        0,
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {contentCard(
              <>
                <div style={{ ...styles.row, marginBottom: 18 }}>
                  <h2 style={styles.sectionTitle}>
                    {activePage === "appointments"
                      ? "Appointment schedule"
                      : activePage === "billing"
                        ? "Invoices & payments"
                        : activePage === "reports"
                          ? "Service reports"
                          : "Customers & vehicles"}
                  </h2>

                  <span style={styles.muted}>
                    {filtered.length} record
                    {filtered.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <input
                    style={styles.input}
                    placeholder="Search customer, vehicle..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />

                  <select
                    style={styles.input}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {[
                      "All statuses",
                      "Pending",
                      "In Progress",
                      "Completed",
                      "Delivered",
                    ].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>

                  <select
                    style={styles.input}
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                  >
                    {["All payments", "Paid", "Unpaid", "Partial"].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>

                  <select
                    style={styles.input}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="appointment">Appointment date</option>
                  </select>

                  {activePage === "reports" && (
                    <>
                      <label>
                        <span style={styles.label}>From date</span>
                        <input
                          style={styles.input}
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                        />
                      </label>

                      <label>
                        <span style={styles.label}>To date</span>
                        <input
                          style={styles.input}
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                        />
                      </label>
                    </>
                  )}

                  <button
                    style={styles.buttonSecondary}
                    onClick={() => {
                      setQuery("");
                      setStatusFilter("All statuses");
                      setPaymentFilter("All payments");
                      setSortBy("newest");
                      setDateFrom("");
                      setDateTo("");
                    }}
                  >
                    Clear filters
                  </button>
                </div>

                {activePage === "billing" && (
                  <div
                    style={{
                      marginBottom: 14,
                      color: "#718096",
                      fontSize: 12,
                    }}
                  >
                    To record a payment, choose Edit on an invoice and update
                    the amount paid. Payment status is calculated automatically.
                  </div>
                )}

                <RecordTable rows={visibleRows} />

                <div style={{ ...styles.row, paddingTop: 16 }}>
                  <span style={styles.muted}>
                    Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–
                    {Math.min(page * pageSize, filtered.length)} of{" "}
                    {filtered.length}
                  </span>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <button
                      style={styles.buttonSecondary}
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      ← Previous
                    </button>

                    <span style={{ fontSize: 13 }}>
                      {page} / {totalPages}
                    </span>

                    <button
                      style={styles.buttonSecondary}
                      disabled={page >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </>,
            )}
          </>
        )}
        {modalOpen && (
          <div
            style={styles.overlay}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setModalOpen(false);
            }}
          >
            <div
              style={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="record-form-title"
            >
              <div style={{ ...styles.row, marginBottom: 20 }}>
                <div>
                  <h2 id="record-form-title" style={{ margin: 0 }}>
                    {editingId ? "Edit service record" : "Add service record"}
                  </h2>
                  <div style={styles.muted}>Fields marked * are required.</div>
                </div>

                <button
                  style={styles.buttonSecondary}
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={saveRecord}>
                <div style={styles.formGrid}>
                  <Field
                    label="Customer name"
                    name="customer"
                    value={form.customer}
                    onChange={handleFormChange}
                    required
                  />

                  <Field
                    label="Phone number"
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    required
                  />

                  <Field
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    type="email"
                  />

                  <Field
                    label="Vehicle registration"
                    name="vehicleNo"
                    value={form.vehicleNo}
                    onChange={handleFormChange}
                    required
                  />

                  <Field
                    label="Make"
                    name="make"
                    value={form.make}
                    onChange={handleFormChange}
                    required
                  />

                  <Field
                    label="Model"
                    name="model"
                    value={form.model}
                    onChange={handleFormChange}
                    required
                  />

                  <Field
                    label="Year"
                    name="year"
                    value={form.year}
                    onChange={handleFormChange}
                    type="number"
                  />

                  <Field
                    label="Mileage (km)"
                    name="mileage"
                    value={form.mileage}
                    onChange={handleFormChange}
                    type="number"
                  />

                  <Field
                    label="Service type"
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleFormChange}
                    options={[
                      "Full Service",
                      "Oil Change",
                      "Brake Service",
                      "AC Repair",
                      "General Repair",
                      "Tyre Service",
                      "Engine Repair",
                      "Other",
                    ]}
                  />

                  <Field
                    label="Appointment date"
                    name="appointment"
                    value={form.appointment}
                    onChange={handleFormChange}
                    type="date"
                    required
                  />

                  <Field
                    label="Next service date"
                    name="nextService"
                    value={form.nextService}
                    onChange={handleFormChange}
                    type="date"
                  />

                  <Field
                    label="Job status"
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    options={[
                      "Pending",
                      "In Progress",
                      "Completed",
                      "Delivered",
                    ]}
                  />

                  <Field
                    label="Assigned mechanic"
                    name="mechanic"
                    value={form.mechanic}
                    onChange={handleFormChange}
                    options={[
                      "Unassigned",
                      "Karthik",
                      "Manoj",
                      "Ravi",
                      "Sanjay",
                    ]}
                  />

                  <Field
                    label="Invoice amount (₹)"
                    name="amount"
                    value={form.amount}
                    onChange={handleFormChange}
                    type="number"
                  />

                  <Field
                    label="Amount paid (₹)"
                    name="amountPaid"
                    value={form.amountPaid}
                    onChange={handleFormChange}
                    type="number"
                  />
                </div>

                <label style={{ display: "block", marginTop: 14 }}>
                  <span style={styles.label}>Notes</span>
                  <textarea
                    style={{
                      ...styles.input,
                      minHeight: 85,
                      resize: "vertical",
                    }}
                    name="notes"
                    value={form.notes}
                    onChange={handleFormChange}
                  />
                </label>

                <div
                  style={{
                    ...styles.row,
                    marginTop: 22,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    style={styles.buttonSecondary}
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" style={styles.button}>
                    {editingId ? "Save changes" : "Add record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {viewRecord && (
          <div
            style={styles.overlay}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setViewRecord(null);
            }}
          >
            <div
              style={{ ...styles.modal, maxWidth: 620 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="record-detail-title"
            >
              <div style={{ ...styles.row, marginBottom: 20 }}>
                <h2 id="record-detail-title" style={{ margin: 0 }}>
                  Service record details
                </h2>
                <button
                  style={styles.buttonSecondary}
                  onClick={() => setViewRecord(null)}
                >
                  ✕ Close
                </button>
              </div>

              <h3 style={{ marginBottom: 4 }}>{viewRecord.customer}</h3>
              <div style={styles.muted}>
                {viewRecord.vehicleNo} · {viewRecord.make} {viewRecord.model}
              </div>

              <div
                style={{
                  ...styles.grid,
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  marginTop: 20,
                }}
              >
                {[
                  ["Phone", viewRecord.phone],
                  ["Email", viewRecord.email || "—"],
                  ["Service", viewRecord.serviceType],
                  ["Appointment", viewRecord.appointment],
                  ["Next service", viewRecord.nextService || "—"],
                  ["Mechanic", viewRecord.mechanic],
                  ["Mileage", `${viewRecord.mileage || "—"} km`],
                  ["Invoice", money(viewRecord.amount)],
                  ["Paid", money(viewRecord.amountPaid ?? 0)],
                  [
                    "Balance",
                    money(
                      Math.max(
                        0,
                        Number(viewRecord.amount || 0) -
                          Number(viewRecord.amountPaid || 0),
                      ),
                    ),
                  ],
                ].map(([label, value]) => (
                  <div key={label} style={{ ...cardStyle, padding: 13 }}>
                    <div style={styles.metricLabel}>{label}</div>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <div
                style={{
                  ...styles.row,
                  justifyContent: "flex-start",
                  marginBottom: 14,
                }}
              >
                <StatusPill status={viewRecord.status} />
                <StatusPill status={viewRecord.payment} />
              </div>

              <p style={{ whiteSpace: "pre-wrap", color: "#59677d" }}>
                {viewRecord.notes || "No notes added."}
              </p>

              <div
                style={{
                  ...styles.row,
                  justifyContent: "flex-end",
                }}
              >
                <button
                  style={styles.buttonSecondary}
                  onClick={() => printInvoice(viewRecord)}
                >
                  🖨 Print invoice
                </button>

                <button
                  style={styles.buttonSecondary}
                  onClick={() => sendWhatsAppReminder(viewRecord)}
                >
                  WhatsApp reminder
                </button>

                <button
                  style={styles.buttonSecondary}
                  onClick={() => {
                    const current = viewRecord;
                    setViewRecord(null);
                    openEdit(current);
                  }}
                >
                  Edit record
                </button>

                <button
                  style={{ ...styles.button, background: "#dc2626" }}
                  onClick={() => deleteRecord(viewRecord.id)}
                >
                  Delete record
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            right: 22,
            bottom: 22,
            zIndex: 20,
            background: "#15243b",
            color: "#fff",
            borderRadius: 10,
            padding: "13px 18px",
            boxShadow: "0 8px 28px #0002",
            fontSize: 14,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
