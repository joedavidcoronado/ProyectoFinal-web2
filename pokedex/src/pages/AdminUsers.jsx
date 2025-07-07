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
            <main className="py-4" style={{ minHeight: "85vh", backgroundColor: "#1a1a1a", color: "white" }}>
                <Container style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <h2 className="mb-4">Gestión de Usuarios</h2>
                    {loading ? (
                        <Spinner animation="border" variant="warning" style={{width:'40px', height:'40px'}}/>
                    ) : (
                        <>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th style={{background:'black'}}>ID</th>
                                    <th style={{background:'black'}}>Nombre</th>
                                    <th style={{background:'black'}}>Correo</th>
                                    <th style={{background:'black'}}>Tipo</th>
                                    <th style={{background:'black'}}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.nombre}</td>
                                        <td>{u.correo}</td>
                                        <td>{u.tipo}</td>
                                        <td>
                                            {u.tipo === "admin" ? (
                                                <Button variant="danger" size="sm" onClick={() => cambiarRol(u.id)}>
                                                    Quitar Admin
                                                </Button>
                                            ) : (
                                                <Button variant="warning" size="sm" onClick={() => cambiarRol(u.id)}>
                                                    Hacer Admin
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {!loading && (
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: "20px", textAlign: "center" , width:'50%'}}>
                                <p style={{fontSize:'19px'}}>Total de usuarios: <strong style={{color:'#FFC107'}}>{usuarios.length}</strong></p>
                                <p style={{fontSize:'19px'}}>Admins: <strong style={{color:'#FFC107'}}>{usuarios.filter(u => u.tipo === "admin").length}</strong></p>
                                <p style={{fontSize:'19px'}}>Normales: <strong style={{color:'#FFC107'}}>{usuarios.filter(u => u.tipo === "normal").length}</strong></p>
                            </div>
                        )}
                        </>
                    )}
                </Container>
            </main>
            <Footer />
        </>
    );
};

export default AdminUser;
