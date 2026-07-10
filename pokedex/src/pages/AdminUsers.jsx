import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Spinner } from "react-bootstrap";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { useAuth } from "../../hooks/useAuth";

const AdminUser = () => {
    const { getAuthUser } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = getAuthUser();

    const fetchUsuarios = async () => {
        try {
            const res = await axios.get("http://localhost:3001/usuarios", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsuarios(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const cambiarRol = async (id) => {
        const usuario = usuarios.find(u => u.id === id);
        const nuevoRol = usuario.tipo === "admin" ? "normal" : "admin";

        const confirmar = window.confirm(`¿Estás seguro de cambiar el rol de este usuario a ${nuevoRol}?`);
        if (!confirmar) return;

        try {
            await axios.put(`http://localhost:3001/usuarios/rol/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Rol actualizado correctamente");
            fetchUsuarios();
        } catch (error) {
            console.error("Error al cambiar el rol:", error);
            alert("No se pudo cambiar el rol");
        }
    };


    return (
        <>
            <Menu />
            <main className="admin-page">
                <div className="admin-page-noise" />
                <Container className="admin-container">
                    <h2 className="admin-titulo">Gestión de Usuarios</h2>
                    {loading ? (
                        <div className="admin-loading">
                            <Spinner animation="border" className="admin-spinner" />
                        </div>
                    ) : (
                        <>
                        <div className="admin-table-wrap">
                            <Table className="admin-table" hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Tipo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((u) => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.nombre}</td>
                                            <td>{u.correo}</td>
                                            <td>
                                                <span className={`admin-badge-tipo ${u.tipo === "admin" ? "admin-badge-tipo--admin" : "admin-badge-tipo--normal"}`}>
                                                    {u.tipo}
                                                </span>
                                            </td>
                                            <td>
                                                {u.tipo === "admin" ? (
                                                    <Button className="btn-admin-rol btn-admin-rol--quitar" size="sm" onClick={() => cambiarRol(u.id)}>
                                                        Quitar Admin
                                                    </Button>
                                                ) : (
                                                    <Button className="btn-admin-rol btn-admin-rol--dar" size="sm" onClick={() => cambiarRol(u.id)}>
                                                        Hacer Admin
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        {!loading && (
                            <div className="admin-resumen">
                                <div className="admin-resumen-item">
                                    <p>Total de usuarios</p>
                                    <strong>{usuarios.length}</strong>
                                </div>
                                <div className="admin-resumen-item">
                                    <p>Admins</p>
                                    <strong>{usuarios.filter(u => u.tipo === "admin").length}</strong>
                                </div>
                                <div className="admin-resumen-item">
                                    <p>Normales</p>
                                    <strong>{usuarios.filter(u => u.tipo === "normal").length}</strong>
                                </div>
                            </div>
                        )}
                        </>
                    )}
                </Container>
            </main>
            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .admin-page {
                    position: relative;
                    font-family: 'Nunito', sans-serif;
                    background: radial-gradient(circle at 50% 0%, #241012 0%, #181818 55%, #101010 100%);
                    min-height: 85vh;
                    color: white;
                    padding: 32px 0;
                    overflow: hidden;
                }

                .admin-page-noise {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 30px 30px;
                    pointer-events: none;
                }

                .admin-container {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .admin-titulo {
                    font-weight: 900;
                    color: #ff5b45;
                    text-shadow: 0 0 16px rgba(231,76,60,0.5);
                    letter-spacing: 1px;
                    margin-bottom: 28px;
                }

                .admin-loading {
                    padding: 60px 0;
                }

                .admin-spinner {
                    width: 40px;
                    height: 40px;
                    color: #FFC107;
                }

                /* ── Tabla ── */
                .admin-table-wrap {
                    width: 100%;
                    max-width: 900px;
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%);
                    border: 2px solid #333;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 12px 28px rgba(0,0,0,0.4);
                }

                .admin-table {
                    margin: 0;
                    color: white;
                }

                .admin-table thead th {
                    background: #151515;
                    color: #FFC107;
                    font-family: 'Press Start 2P', monospace;
                    font-size: 0.6rem;
                    letter-spacing: 0.3px;
                    padding: 14px 12px;
                    border-bottom: 2px solid #333;
                    border-top: none;
                }

                .admin-table tbody td {
                    background: transparent;
                    color: #ddd;
                    padding: 12px;
                    border-color: #2a2a2a;
                    vertical-align: middle;
                }

                .admin-table tbody tr:hover td {
                    background: rgba(255,193,7,0.05);
                    color: white;
                }

                .admin-badge-tipo {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.3px;
                    text-transform: uppercase;
                }

                .admin-badge-tipo--admin {
                    background: linear-gradient(135deg, #ffca28, #FFC107);
                    color: #1a1a1a;
                }

                .admin-badge-tipo--normal {
                    background: #2a2a2a;
                    color: #aaa;
                    border: 1px solid #3a3a3a;
                }

                .btn-admin-rol {
                    border: none !important;
                    border-radius: 999px !important;
                    font-weight: 700;
                    font-size: 0.78rem;
                    padding: 6px 14px !important;
                    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
                }

                .btn-admin-rol:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                }

                .btn-admin-rol--dar {
                    background: linear-gradient(135deg, #ffca28, #FFC107) !important;
                    color: #1a1a1a !important;
                    box-shadow: 0 3px 0 #b28600;
                }

                .btn-admin-rol--quitar {
                    background: linear-gradient(135deg, #ff5b45, #e74c3c) !important;
                    color: white !important;
                    box-shadow: 0 3px 0 #a62110;
                }

                /* ── Resumen ── */
                .admin-resumen {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    margin-top: 24px;
                    width: 100%;
                    max-width: 700px;
                    flex-wrap: wrap;
                }

                .admin-resumen-item {
                    flex: 1;
                    min-width: 140px;
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%);
                    border: 1px solid #333;
                    border-radius: 12px;
                    padding: 14px 18px;
                    text-align: center;
                }

                .admin-resumen-item p {
                    color: #999;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin: 0 0 6px;
                }

                .admin-resumen-item strong {
                    color: #FFC107;
                    font-size: 1.3rem;
                    font-weight: 900;
                }

                @media (max-width: 600px) {
                    .admin-resumen {
                        flex-direction: column;
                    }
                    .admin-resumen-item {
                        width: 100%;
                    }
                }
            `}</style>
        </>
    );
};

export default AdminUser;