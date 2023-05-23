import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Modal, Form, Button, ListGroup, Dropdown } from "react-bootstrap";
import Map from './Map'



function SelectResto() {
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
    axios.get('http://localhost:3001/api/cities')
      .then(response => {
        setCities(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    // récupération des villes depuis l'API
    axios.get('http://localhost:3001/api/specialities')
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
    axios.get(`http://localhost:3001/api/zones/city/${cityId}`)
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
    axios.get(`http://localhost:3001/api/restos/zone/${selectedArea}/specialites/${selectedSpecialities}`)
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

      })
      .catch(error => {
        console.log(error);
        setRestaurants([]);
        setRestaurantCoords([]);
        setRestaurantNames([]);

      });
  }


  const handleRestaurantDetailsClick = (restaurantId) => {
    // récupération des détails du restaurant sélectionné depuis l'API et affichage
    axios.get(`http://localhost:3001/api/restos/${restaurantId}`)
      .then(response => {
        alert(`Détails du restaurant : ${response.data.name}, ${response.data.adresse}`);

      })
      .catch(error => {
        console.log(error);
      });
  };

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
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleShowDetailsModal = (restaurantId) => {
    axios.get(`http://localhost:3001/api/restos/${restaurantId}`)
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
            const response = await axios.get(`http://localhost:3001/api/specialities/${specialityId}`);
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
  return (
    <>
      <div className="py-5">
        <Row className="align-items-start flex-wrap">
          <Col md={15} className="d-flex justify-content-center ">
            <Form className="form-inline d-inline-flex">
              <Form.Group controlId="city-select" className="form-group mr-3 mb-2 custom-group-class">
                <Form.Control as="select" onChange={handleCityChange} className="bg-primary form-select text-light border-0">
                  <option value="">Sélectionnez une ville</option>
                  {cities.map(city => (
                    <option key={city._id} value={city._id}>{city.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="area-select" className="form-group mr-3 mb-2 custom-group-class" disabled={!selectedCity}>
                <Form.Control as="select" onChange={handleAreaChange} className="bg-primary form-select text-light border-0">
                  <option value="">Sélectionnez une zone</option>
                  {areas.map(area => (
                    <option key={area._id} value={area._id}>{area.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="specialite-select" className="form-group mr-3 mb-2 custom-group-class">
                <Dropdown className="w-100">
                  <Dropdown.Toggle id="specialite-dropdown">
                    Spécialités
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="p-0">
                    {specialities.map(specialite => (
                      <Form.Check
                        key={specialite._id}
                        type="checkbox"
                        id={`specialite-${specialite._id}`}
                        label={specialite.name}
                        name={specialite.name}
                        value={specialite._id}
                        onChange={handleSpecialiteChange}
                        className="bg-light border-0 rounded-0"
                      />
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              <Button variant="primary" onClick={handleSearchClique} className="mb-2">
                Chercher
              </Button>
            </Form>

          </Col>
        </Row>
      </div>
<div>
      
        <Row>
          <Col>
            <ListGroup style={{ width: "90%", marginLeft: "8%" }}>
              {restaurants.map(restaurant => (
                <ListGroup.Item key={restaurant._id} className="d-flex justify-content-between align-items-center">
                  <div>
              
                    <img src={restaurant.image} alt={restaurant.name} style={{ maxWidth: "300px", maxHeight: "300px", marginRight: "1rem" }} />
        {restaurant.name}
                  </div>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleShowDetailsModal(restaurant._id)}
                  >
                    Détails
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>

            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
              <Modal.Header closeButton>
                <Modal.Title>Détails du restaurant - </Modal.Title>
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

          </Col>


          <Col >
            <Map zoneId={selectedArea} restoCord={restoCords} restoName={restoNames} /></Col>
        </Row>
      

      </div>


    </>
  );




}

export default SelectResto;


//return (
//  <>
//    <h1>Sélection de restaurants</h1>
//    <div>
//      <label htmlFor="city-select">Ville :</label>
//      <select id="city-select" onChange={handleCityChange}>
//        <option value="">Sélectionnez une ville</option>
//        {cities.map(city => (
//          <option key={city._id} value={city._id}>{city.name}</option>
//        ))}
//      </select>
//    </div>
//    <div>
//      <label htmlFor="area-select">Zone :</label>
//      <select id="area-select" onChange={handleAreaChange} disabled={!selectedCity}>
//        <option value="">Sélectionnez une zone</option>
//        {areas.map(area => (
//          <option key={area._id} value={area._id}>{area.name}</option>
//        ))}
//      </select>
//    </div>
//    <div>
//      <label htmlFor="specialite-select">Specialites :</label>
//      <select id="specialite-select" onChange={handleSpecialiteChange} multiple>
//        <option value="">Sélectionnez les specialites</option>
//        {specialities.map(specialite => (
//          <option key={specialite._id} value={specialite._id}>{specialite.name}</option>
//        ))}
//      </select>
//    </div>
//    <button onClick={handleSearchClique}>Chercher</button>
//    <div>
//      <label htmlFor="restaurant-select">Restaurant :</label>
//      <ul id="restaurant-select">
//        {restaurants.map(restaurant => (
//          <li key={restaurant._id}>
//            {restaurant.name}
//            <button onClick={() => handleRestaurantDetailsClick(restaurant._id)}>Détails</button>
//          </li>
//        ))}
//      </ul>
//    </div>
//
//
//  </>
//);
//}
