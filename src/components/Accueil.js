import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Map from './Map'
import '../styles/Accueil.css';
import { Container, Row, Col, Modal, Form, Button, ListGroup, Dropdown } from "react-bootstrap";


const Accueil = () => {

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [areas, setZones] = useState([]);
    const [selectedArea, setSelectedZone] = useState(null);
    const [restoCords, setRestaurantCoords] = useState([]);
    const [restoNames, setRestaurantNames] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [selectedSpecialities, setSelectedSpecialities] = useState([null]);
    const [selectedSpecialitiesName, setSelectedSpecialitiesName] = useState([null]);

    useEffect(() => {
        // récupération des villes depuis l'API
        axios.get('https://resto-api-dun.vercel.app/api/cities')
            .then(response => {
                setCities(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        // récupération des villes depuis l'API
        axios.get('https://resto-api-dun.vercel.app/api/specialities')
            .then(response => {
                setSpecialities(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleCityChange = (event) => {
        // mise à jour de la ville sélectionnée
        const cityId = event.target.value;
        setSelectedCity(cityId);

        // récupération des zones associées à la ville sélectionnée depuis l'API
        axios.get(`https://resto-api-dun.vercel.app/api/zones/city/${cityId}`)
            .then(response => {
                setZones(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleAreaChange = (event) => {
        // mise à jour de la zone sélectionnée
        const areaId = event.target.value;
        setSelectedZone(areaId);
        setRestaurantNames([]);
        setRestaurants([]);
        setRestaurantCoords([]);



    };

    const handleSearchClique = () => {
        // récupération des restaurants correspondants depuis l'API
        axios.get(`https://resto-api-dun.vercel.app/api/restos/zone/${selectedArea}/specialites/${selectedSpecialities}`)
            .then(response => {
                const restaurants = response.data;
                const restaurantCoords = restaurants.map(restaurant => {
                    return restaurant.cords;
                });
                const restaurantNames = restaurants.map(restaurant => {
                    return restaurant.name;
                });

                setRestaurants(response.data);
                setRestaurantCoords(restaurantCoords);
                setRestaurantNames(restaurantNames);
                console.log(restaurantNames);

            })
            .catch(error => {
                console.log(error);
                setRestaurants([]);
                setRestaurantCoords([]);
                setRestaurantNames([]);

            });
    }




    const handleSpecialiteChange = (event) => {
        const selectedOptions = event.target.closest('.dropdown-menu').querySelectorAll('input[type="checkbox"]:checked');
        const selectedValues = [];
        const selectedName = [];

        selectedOptions.forEach((option) => {
            selectedValues.push(option.value);
            selectedName.push(option.name);
        });

        setSelectedSpecialities(selectedValues.join("&"));
        setSelectedSpecialitiesName(selectedName);
    };


    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState({"name":"","cords":""});

    const handleShowDetailsModal = (restaurantId) => {
        axios.get(`https://resto-api-dun.vercel.app/api/restos/${restaurantId}`)
            .then(response => {
                setSelectedRestaurant(response.data);
                setShowDetailsModal(true);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleCloseDetailsModal = () => setShowDetailsModal(false);

    console.log(selectedSpecialities);
    console.log(selectedSpecialitiesName);
    const [specialityNames, setSpecialityNames] = useState([]);

    useEffect(() => {
        async function fetchSpecialityNames() {
            const names = await Promise.all(
                selectedRestaurant.specialite.map(async (specialityId) => {
                    try {
                        const response = await axios.get(`https://resto-api-dun.vercel.app/api/specialities/${specialityId}`);
                        return response.data.name;
                    } catch (error) {
                        console.error(error);
                    }
                })
            );
            setSpecialityNames(names);
        }

        if (selectedRestaurant) {
            fetchSpecialityNames();
        }
    }, [selectedRestaurant]);
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    const [showOptions, setShowOptions] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleToggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleOptionChange = (event) => {
        const { value } = event.target;
        const newOptions = [...selectedOptions];
        if (selectedOptions.includes(value)) {
            const index = selectedOptions.indexOf(value);
            newOptions.splice(index, 1);
        } else {
            newOptions.push(value);
        }
        setSelectedOptions(newOptions);
        handleSpecialiteChange(event);
    };

    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                ref.current &&
                !ref.current.contains(event.target) &&
                !event.target.closest('summary') &&
                !event.target.closest('label')
            ) {
                setShowOptions(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [ref]);

    return (
        <>
            <div className='container'>
                <nav>
                    <select onChange={handleCityChange}>
                        <option value="">Sélectionnez une ville</option>
                        {cities.map(city => (
                            <option key={city._id} value={city._id}>{city.name}</option>
                        ))}
                    </select>

                    <select onChange={handleAreaChange}>

                        <option value="0">Sélectionnez une zone</option>
                        {areas.map(area => (
                            <option key={area._id} value={area._id}>{area.name}</option>
                        ))}

                    </select>


                    <Dropdown >
                        <Dropdown.Toggle >
                            Spécialités
                        </Dropdown.Toggle>
                        <Dropdown.Menu >
                            {specialities.map(specialite => (
                                <Form.Check
                                    key={specialite._id}
                                    type="checkbox"
                                    id={`specialite-${specialite._id}`}
                                    label={specialite.name}
                                    name={specialite.name}
                                    value={specialite._id}
                                    onChange={handleSpecialiteChange}

                                />
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                </nav>
                <button onClick={handleSearchClique}>Chercher</button>
            </div>

            <div className='nbr-resto'>
                    {restaurants.length > 0 && <p >Restaurants trouvés :  {restaurants.length}</p>}
                    {restaurants.length == 0 && <p>Pas de Restaurants trouvés</p>}
                </div>


            <div className='container2'>
                


                <div className="gallery">
                    {restaurants.map((restaurant, index) => (
                        <div key={restaurant._id} className="image-item">
                            <img className="image" src={restaurant.image} alt={restaurant.name} />
                            <div className="image-info">
                                <h2 className="image-title">{restaurant.name}</h2>
                                <p className="image-description">{restaurant.adresse}</p>
                            </div>
                            <Button
                                variant="outline-primary"
                                onClick={() => handleShowDetailsModal(restaurant._id)}
                            >
                                Détails
                            </Button>
                        </div>

                    ))}
                </div>

                <Modal className='modal' show={showDetailsModal} onHide={handleCloseDetailsModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Détails du restaurant -{selectedRestaurant.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedRestaurant && (
                            <>
                                <p>Nom: {selectedRestaurant.name}</p>
                                <p>Adresse: {selectedRestaurant.adresse}</p>
                                <p>Coordonnées: {selectedRestaurant.cords[0]} , {selectedRestaurant.cords[1]}</p>
                                <p>Specialite: </p>
                                <ul>
                                    {specialityNames.map((name) => (
                                        <li key={name}>{name}</li>
                                    ))}
                                </ul>
                                <p></p>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDetailsModal}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <div className='container3'>
                <br />
                <br />
                <br />
                <Map zoneId={selectedArea} restoCord={restoCords} restoName={restoNames} />

            </div>


        </>
    );
};

export default Accueil;


