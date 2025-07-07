import { useEffect, useState } from 'react';
import { Card, Row, Col, Container, Button, Image } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";


const DetallePokemon = () => {
    const { getAuthUser } = useAuth(true);
    const [equipo, setEquipo] = useState(null);
    const { equipoId } = useParams();
    const navigate = useNavigate();

    const [edit, setEdit] = useState(false);
    const [nombreEditado, setNombreEditado] = useState("");


    const fetchDatos = async () => {
        const { token } = getAuthUser();
        try {
            const resEquipo = await axios.get(`http://localhost:3001/equipos/equipodetalle/${equipoId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEquipo(resEquipo.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    };

    useEffect(() => {
        fetchDatos();
    }, [equipoId]);

    useEffect(() => {
        if (equipo) {
            setNombreEditado(equipo.nombre);
        }
    }, [equipo]);


    const borrarPokemon = async (pokemonId, equipoId) => {
        const { token } = getAuthUser();
        try {
            await axios.delete(`http://localhost:3001/pokemones_equipo/${pokemonId}/${equipoId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchDatos(); 
        } catch (error) {
            console.error("Error al eliminar el Pokémon:", error);
            alert("Error al eliminar el Pokémon. Por favor, inténtalo de nuevo.");
        }
    };

    const updateEquipo = async () => {
        const { token } = getAuthUser();
        try {
            await axios.put(`http://localhost:3001/equipos/${equipoId}`, 
                { nombre: nombreEditado },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEdit(false);
            fetchDatos(); 
        } catch (error) {
            console.error("Error al actualizar el equipo:", error);
            alert("No se pudo actualizar el nombre del equipo.");
        }
    };


    return (
        <>
            <Menu />
            <main
                className="py-3"
                style={{
                backgroundColor: "#272727",
                minHeight: "90vh",
                color: "white",
            }}
            >
                <Container className="p-4" 
                    style={{
                    color: "white",
                    width: "100%",
                    }}
                >   
                {!equipo
                        ?   
                        <div className="text-center my-5">
                            <img src="../../public/vacio.png" alt="img.png" style={{ width: '20%', marginTop: '30px' }} />
                            <p className="mt-3">No hay pokemones...</p>
                        </div>
                        : 
                            <>
                            {!edit ? (
                                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                    <h2 className="mb-4">Pokémon del Equipo: <strong style={{color:'#FFC107'}}>{equipo.nombre}</strong></h2>
                                    <span onClick={() => setEdit(true)} style={{cursor: 'pointer'}}>
                                        <FontAwesomeIcon icon={faEdit} style={{color:'white', width:'26px', height:'26px', marginBottom:'17px', marginLeft:'10px'}}/>
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <h5>Edita el nombre de tu equipo</h5>
                                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                        <input
                                            type="text"
                                            value={nombreEditado}
                                            onChange={(e) => setNombreEditado(e.target.value)}
                                            style={{backgroundColor:'#FFC107', fontSize: '23px', fontWeight:'bold', padding: '5px', borderRadius: '5px', marginBottom:'20px'}}
                                        />
                                        <span onClick={updateEquipo} style={{cursor: 'pointer'}}>
                                            <FontAwesomeIcon icon={faSave} style={{color:'white', width:'26px', height:'26px', marginBottom:'17px', marginLeft:'10px'}}/>
                                        </span>
                                    </div>
                                </>
                            )} 
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {equipo.pokemonesequipo?.map((poke, index) => (
                                    <Col key={index}>
                                        <Card className="shadow-lg" style={{ backgroundColor: 'black', color: 'white' }}>
                                            <h5 style={{backgroundColor:'#FFC107',color:'black', margin:'5px'}}>{poke.base.nombre}</h5>
                                            <Card.Img
                                                variant="top"
                                                src={`http://localhost:3001/uploads/pokemon/${poke.pokemonId}.png`}
                                                alt={poke.apodo || "pokemon"}
                                                style={{ objectFit: 'contain', height: 200 , marginTop: '10px'}}
                                            />
                                            <Card.Body>
                                                <div className="d-flex justify-content-center align-items-center mb-3">
                                                    <h4 style={{color:'white'}}>{poke.apodo || poke.base?.nombre}{" "}</h4>
                                                    <img style={{width:'100px', marginLeft:'20px'}} src={`http://localhost:3001/uploads/tipo/${poke.tipo.id}.png`} alt="tipo.png" />
                                                </div>

                                                <Card.Subtitle className="mb-2" style={{color: '#FFC107'}}>
                                                    Naturaleza: <strong style={{color: 'white'}}>{poke.naturaleza?.nombre}</strong>
                                                </Card.Subtitle>

                                                {/*<Card.Text>
                                                    <strong>EVs:</strong> HP {poke.ev_hp} / Atk {poke.ev_attack} / Def {poke.ev_defense} / SpA {poke.ev_sp_atk} / SpD {poke.ev_sp_def} / Spe {poke.ev_speed}
                                                    <br />
                                                    <strong>IVs:</strong> HP {poke.iv_hp} / Atk {poke.iv_attack} / Def {poke.iv_defense} / SpA {poke.iv_sp_atk} / SpD {poke.iv_sp_def} / Spe {poke.iv_speed}
                                                    <br />
                                                    <strong>Item:</strong> {poke.item?.nombre || 'Ninguno'}
                                                </Card.Text>*/}
                                                
                                                <hr className="border-light" />
                                                <strong>EVs: Valores de Esfuerzo</strong>
                                                <ResponsiveContainer width="100%" height={130} style={{backgroundColor: '#272727', padding: '15px 35px 0 0', borderRadius: '15px'}}>
                                                    <BarChart
                                                    data={[
                                                        { name: 'HP', value: poke.ev_hp },
                                                        { name: 'Atk', value: poke.ev_attack },
                                                        { name: 'Def', value: poke.ev_defense },
                                                        { name: 'SpA', value: poke.ev_sp_atk },
                                                        { name: 'SpD', value: poke.ev_sp_def },
                                                        { name: 'Spe', value: poke.ev_speed },
                                                    ]}
                                                    >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="value" fill="#f1c40f" name="EVs" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                                <hr />
                                                {/* IVs Chart */}
                                                <strong>IVs: Valores Individuales</strong>
                                                <ResponsiveContainer width="100%" height={130} style={{backgroundColor: '#272727', padding: '15px 35px 0 0', borderRadius: '15px'}}>
                                                    <BarChart
                                                    data={[
                                                        { name: 'HP', value: poke.iv_hp },
                                                        { name: 'Atk', value: poke.iv_attack },
                                                        { name: 'Def', value: poke.iv_defense },
                                                        { name: 'SpA', value: poke.iv_sp_atk },
                                                        { name: 'SpD', value: poke.iv_sp_def },
                                                        { name: 'Spe', value: poke.iv_speed },
                                                    ]}
                                                    >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="value" fill="#3498db" name="IVs" />
                                                    </BarChart>
                                                </ResponsiveContainer>

                                                <hr className="border-light" />
                                                <section style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div style={{width: '98px', marginRight: '30px'}}>
                                                        <strong style={{color:"#f1c40f"}}>Habilidades</strong>
                                                        <hr />
                                                        {poke.habilidadesRel?.map((hab, i) => (
                                                            <strong><p key={i} style={{margin:'0px'}}>{hab.nombre}</p> </strong>
                                                        ))}
                                                    </div>
                                                <div style={{width:'90%', marginRight: '20px'}}>
                                                    <strong style={{color:"#f1c40f"}}>Movimientos</strong>
                                                    <hr />
                                                    {poke.movimientosRel?.map((mov, i) => (
                                                        <p key={i} style={{margin:'0px'}}>
                                                            <strong>{mov.nombre}</strong>{" "} <br /> {mov.categoria}{mov.power ? `- ${mov.power} power` : ""}
                                                        </p>
                                                    ))}
                                                </div>
                                                </section>

                                                <section className='mt-4' style={{display:'flex', backgroundColor:'#272727', borderRadius:'15px', padding:'0px 0px 10px 20px'}}>
                                                    <Image
                                                        src={`http://localhost:3001/uploads/item/${poke.item?.id}.png`}
                                                        style={{ width: "100px" , margin:'18px 0px'}}
                                                        className="mb-2"
                                                    />
                                                    <div className='mt-4' style={{marginLeft:'15px', width:'170px'}}> 
                                                        <h4>{poke.item?.nombre}</h4>
                                                        <p>{poke.item?.descripcion}</p>
                                                    </div>
                                                </section>
                                            </Card.Body>
                                            <Card.Footer className="text-center" >
                                                <Button 
                                                    className="m-2" 
                                                    style={{width:'40%'}} 
                                                    variant="warning"
                                                    onClick={() => navigate(`/pokemon/${poke.pokemonId}/${equipoId}`)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button 
                                                    className="m-2" 
                                                    style={{width:'40%'}} 
                                                    type="submit" 
                                                    variant="success" 
                                                    onClick={
                                                        async ()=> { 
                                                            if (window.confirm("¿Estás seguro de eliminar este Pokémon del equipo?")) {
                                                                await borrarPokemon(poke.id, equipoId);
                                                            }}
                                                        }
                                                >
                                                    Eliminar
                                                </Button>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                    </>
                }  
                </Container>
            </main>
            <Footer />
        </>
    );
};

export default DetallePokemon;
