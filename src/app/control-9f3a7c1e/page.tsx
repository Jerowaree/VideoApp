"use client";

import { FormEvent, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import CountrySelector, {
  countries,
  type Country,
} from "@/components/CountrySelector";

type User = {
  id: string;
  name: string;
  phone: string;
  is_active: boolean;
  created_at: string;
};
type Attempt = {
  id: string;
  name: string | null;
  phone: string;
  attempted_at: string;
};

function buildInternationalPhone(phone: string, country: Country) {
  const digits = phone.replace(/\D/g, "");
  const code = country.code.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith(code) ? `+${digits}` : `+${code}${digits}`;
}

function splitPhoneByCountry(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const matchedCountry =
    [...countries]
      .sort((left, right) => right.code.length - left.code.length)
      .find((country) => digits.startsWith(country.code.replace(/\D/g, ""))) ||
    countries[0];
  const countryDigits = matchedCountry.code.replace(/\D/g, "");

  return {
    country: matchedCountry,
    phone: digits.startsWith(countryDigits)
      ? digits.slice(countryDigits.length)
      : digits,
  };
}

export default function SuperadminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [userQuery, setUserQuery] = useState("");
  const [attemptQuery, setAttemptQuery] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [attemptPage, setAttemptPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [attemptTotal, setAttemptTotal] = useState(0);
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");
  const [newCountry, setNewCountry] = useState<Country>(countries[0]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingPhone, setEditingPhone] = useState("");
  const [editingName, setEditingName] = useState("");
  const [editingCountry, setEditingCountry] = useState<Country>(countries[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadUsers = async (page = userPage, query = userQuery) => {
    const response = await fetch(
      `/api/superadmin/users?page=${page}&q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error("No pudimos cargar los usuarios.");
    const data = await response.json();
    setUsers(data.users);
    setUserTotal(data.total);
    setAuthenticated(true);
  };

  const loadAttempts = async (page = attemptPage, query = attemptQuery) => {
    const response = await fetch(
      `/api/superadmin/attempts?page=${page}&q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error("No pudimos cargar los intentos.");
    const data = await response.json();
    setAttempts(data.attempts);
    setAttemptTotal(data.total);
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/superadmin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).error || "No pudimos iniciar sesión.",
        );
      await loadUsers();
      await loadAttempts();
      setPassword("");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "No pudimos iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  };

  const authorizeNumber = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/superadmin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: buildInternationalPhone(newPhone, newCountry),
          name: newName,
        }),
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).error || "No pudimos autorizar el número.",
        );
      setNewPhone("");
      setNewName("");
      setNewCountry(countries[0]);
      await loadUsers(1, userQuery);
    } catch (authorizationError) {
      setError(
        authorizationError instanceof Error
          ? authorizationError.message
          : "No pudimos autorizar el número.",
      );
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (user: User) => {
    const parsedPhone = splitPhoneByCountry(user.phone);
    setEditingUserId(user.id);
    setEditingPhone(parsedPhone.phone);
    setEditingName(user.name === "Sin nombre" ? "" : user.name);
    setEditingCountry(parsedPhone.country);
    setError("");
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditingPhone("");
    setEditingName("");
    setEditingCountry(countries[0]);
  };

  const updateAuthorizedNumber = async (event: FormEvent, id: string) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/superadmin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          phone: buildInternationalPhone(editingPhone, editingCountry),
          name: editingName,
        }),
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).error ||
            "No pudimos actualizar el número autorizado.",
        );
      cancelEditing();
      await loadUsers(userPage, userQuery);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "No pudimos actualizar el número autorizado.",
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteAuthorizedNumber = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/superadmin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).error ||
            "No pudimos eliminar el número autorizado.",
        );
      if (editingUserId === id) cancelEditing();
      await loadUsers(userPage, userQuery);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "No pudimos eliminar el número autorizado.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/superadmin/logout", {
        method: "POST",
      });
      if (!response.ok) throw new Error("No pudimos cerrar sesión.");
      setAuthenticated(false);
      setUsers([]);
      setAttempts([]);
      setPassword("");
      setEditingUserId(null);
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "No pudimos cerrar sesión.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated)
    return (
      <main className="admin-page">
        <section className="admin-login">
          <span className="registration-mark">✦</span>
          <p className="eyebrow">Acceso restringido</p>
          <h1>Panel de superadmin</h1>
          <p className="registration-intro">
            Gestiona la activación de las cuentas registradas.
          </p>
          <form onSubmit={handleLogin} className="admin-form">
            <label>
              Correo
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? (
                <LoadingSpinner label="Verificando..." />
              ) : (
                "Ingresar al panel"
              )}
            </button>
          </form>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
        </section>
      </main>
    );

  const totalPages = (total: number) => Math.max(1, Math.ceil(total / 8));
  const list = (items: Array<User | Attempt>, isAttempt = false) =>
    items.map((item) => {
      if (isAttempt) {
        return (
          <article className="admin-user" key={item.id}>
            <div>
              <strong>{item.name || "Sin nombre"}</strong>
              <span>{item.phone}</span>
            </div>
            <div className="admin-user-action">
              <span className="pending-label">Sin autorización</span>
            </div>
          </article>
        );
      }

      const user = item as User;
      const isEditing = editingUserId === user.id;

      return (
        <article className="admin-user" key={user.id}>
          {isEditing ? (
            <form
              className="admin-user-edit"
              onSubmit={(event) => updateAuthorizedNumber(event, user.id)}
            >
              <div className="admin-phone-field">
                <CountrySelector
                  value={editingCountry}
                  onChange={setEditingCountry}
                  ariaLabel="Elegir país para editar número autorizado"
                />
                <input
                  value={editingPhone}
                  placeholder="Número de celular"
                  onChange={(event) =>
                    setEditingPhone(event.target.value.replace(/\D/g, ""))
                  }
                  inputMode="numeric"
                  required
                />
              </div>
              <input
                value={editingName}
                placeholder="Nombre opcional"
                onChange={(event) => setEditingName(event.target.value)}
              />
              <div className="admin-user-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </button>
                <button
                  className="admin-secondary-button"
                  type="button"
                  onClick={cancelEditing}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <strong>{user.name || "Sin nombre"}</strong>
                <span>{user.phone}</span>
              </div>
              <div className="admin-user-action-group">
                <span className="active-label">Autorizado</span>
                <div className="admin-user-buttons">
                  <button
                    type="button"
                    onClick={() => startEditing(user)}
                    disabled={loading}
                  >
                    Editar
                  </button>
                  <button
                    className="admin-danger-button"
                    type="button"
                    onClick={() => deleteAuthorizedNumber(user.id)}
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </>
          )}
        </article>
      );
    });

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Control de acceso</p>
            <h1>Gestión de registros</h1>
          </div>
          <button
            className="admin-logout"
            type="button"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? "Saliendo..." : "Cerrar sesión"}
          </button>
        </div>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <div className="admin-columns">
          <div className="admin-column">
            <div className="admin-column-heading">
              <h2>Números autorizados</h2>
              <span className="admin-count">{userTotal}</span>
            </div>
            <form className="admin-authorize" onSubmit={authorizeNumber}>
              <div className="admin-phone-field">
                <CountrySelector
                  value={newCountry}
                  onChange={setNewCountry}
                  ariaLabel="Elegir país para autorizar número"
                />
                <input
                  value={newPhone}
                  placeholder="Número de celular"
                  onChange={(event) =>
                    setNewPhone(event.target.value.replace(/\D/g, ""))
                  }
                  inputMode="numeric"
                  required
                />
              </div>
              <input
                value={newName}
                placeholder="Nombre opcional"
                onChange={(event) => setNewName(event.target.value)}
              />
              <button type="submit" disabled={loading}>
                {loading ? (
                  <LoadingSpinner label="Guardando..." />
                ) : (
                  "Autorizar"
                )}
              </button>
            </form>
            <div className="admin-search">
              <input
                value={userQuery}
                placeholder="Filtrar nombre o número"
                onChange={(event) => setUserQuery(event.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  setUserPage(1);
                  loadUsers(1, userQuery);
                }}
              >
                Buscar
              </button>
            </div>
            <div className="admin-list">
              {users.length ? (
                list(users)
              ) : (
                <p className="admin-empty">No hay números autorizados.</p>
              )}
            </div>
            <div className="admin-pagination">
              <button
                type="button"
                disabled={userPage <= 1 || loading}
                onClick={() => {
                  const page = userPage - 1;
                  setUserPage(page);
                  loadUsers(page);
                }}
              >
                Anterior
              </button>
              <span>
                {userPage} / {totalPages(userTotal)}
              </span>
              <button
                type="button"
                disabled={userPage >= totalPages(userTotal) || loading}
                onClick={() => {
                  const page = userPage + 1;
                  setUserPage(page);
                  loadUsers(page);
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
          <div className="admin-column">
            <div className="admin-column-heading">
              <h2>Intentos sin invitación</h2>
              <span className="admin-count">{attemptTotal}</span>
            </div>
            <div className="admin-search">
              <input
                value={attemptQuery}
                placeholder="Filtrar nombre o número"
                onChange={(event) => setAttemptQuery(event.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  setAttemptPage(1);
                  loadAttempts(1, attemptQuery);
                }}
              >
                Buscar
              </button>
            </div>
            <div className="admin-list">
              {attempts.length ? (
                list(attempts, true)
              ) : (
                <p className="admin-empty">No hay intentos registrados.</p>
              )}
            </div>
            <div className="admin-pagination">
              <button
                type="button"
                disabled={attemptPage <= 1 || loading}
                onClick={() => {
                  const page = attemptPage - 1;
                  setAttemptPage(page);
                  loadAttempts(page);
                }}
              >
                Anterior
              </button>
              <span>
                {attemptPage} / {totalPages(attemptTotal)}
              </span>
              <button
                type="button"
                disabled={attemptPage >= totalPages(attemptTotal) || loading}
                onClick={() => {
                  const page = attemptPage + 1;
                  setAttemptPage(page);
                  loadAttempts(page);
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
