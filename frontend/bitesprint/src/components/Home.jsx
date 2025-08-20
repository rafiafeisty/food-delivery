import React, { useState, useEffect } from 'react';
import './Home.css';
import Card from 'react-bootstrap/Card';

const Home = () => {
  const [food, setFood] = useState([]);
  const [filteredFood, setFilteredFood] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState({}); 

  useEffect(() => {
    const storedCounts = JSON.parse(localStorage.getItem('cartCounts')) || {};
    setCounts(storedCounts);
  }, []);

  const getFoodList = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/getfood');
      const data = await response.json();
      setFood(data);
      setFilteredFood(data.slice(0, 10));

      // Initialize counts only for new items not already in localStorage
      setCounts((prevCounts) => {
        const initialCounts = { ...prevCounts };
        data.forEach((item) => {
          if (!(item._id in initialCounts)) {
            initialCounts[item._id] = 0;
          }
        });
        return initialCounts;
      });
    } catch (error) {
      console.error('Error fetching food data:', error);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredFood(food.slice(0, 10));
      return;
    }

    const results = food.filter(
      (item) =>
        item.foodname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fooddescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredFood(results);
  };

  const saveToLocalStorage = (updatedCounts) => {
    localStorage.setItem('cartCounts', JSON.stringify(updatedCounts));
  };

  const plus = (id) => {
    setCounts((prevCounts) => {
      const updatedCounts = {
        ...prevCounts,
        [id]: prevCounts[id] + 1,
      };
      saveToLocalStorage(updatedCounts);
      return updatedCounts;
    });
  };

  const minus = (id) => {
    setCounts((prevCounts) => {
      const updatedCounts = {
        ...prevCounts,
        [id]: prevCounts[id] > 0 ? prevCounts[id] - 1 : 0,
      };
      saveToLocalStorage(updatedCounts);
      return updatedCounts;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    getFoodList();
  }, []);

  return (
    <>
      <div className="home">
        <div className="home-content">
          <h2 className="text-bold">Order the food of your choice</h2>
        </div>
        <div className="img-container">
          <img
            src="https://t3.ftcdn.net/jpg/02/52/38/80/360_F_252388016_KjPnB9vglSCuUJAumCDNbmMzGdzPAucK.jpg"
            alt="logo-img"
          />
          <div className="search-container">
            <input
              type="text"
              placeholder="Search your favorite food"
              id="query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <lord-icon
              src="https://cdn.lordicon.com/wjyqkiew.json"
              trigger="hover"
              className="home-lord search"
              onClick={handleSearch}
            ></lord-icon>
          </div>
        </div>
        <h2
          style={{
            fontSize: '3rem',
            fontWeight: '900',
            marginLeft: '20px',
            marginTop: '40px',
            marginBottom: '40px',
          }}
        >
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Foods'}
        </h2>
        <div className="food-cards">
          {filteredFood.length > 0 ? (
            filteredFood.map((item) => (
              <Card key={item._id} style={{ width: '25rem' }} className="card-body">
                <Card.Img variant="top" src={item.foodpicture} className="card-img-set" />
                <Card.Body>
                  <Card.Title>{item.foodname}</Card.Title>
                  <Card.Text>{item.fooddescription}</Card.Text>
                  <Card.Text>₹{item.price}</Card.Text>
                  <div className="lord-icons-number">
                    <lord-icon
                      src="https://cdn.lordicon.com/vjgknpfx.json"
                      trigger="hover"
                      className="home-lord"
                      onClick={() => plus(item._id)}
                    ></lord-icon>
                    <p
                      className="number"
                      style={{ display: counts[item._id] > 0 ? 'block' : 'none' }}
                    >
                      {counts[item._id]}
                    </p>
                    <lord-icon
                      src="https://cdn.lordicon.com/shlsuhqu.json"
                      trigger="hover"
                      className="home-lord minus"
                      style={{ display: counts[item._id] > 0 ? 'block' : 'none' }}
                      onClick={() => minus(item._id)}
                    ></lord-icon>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No food items found matching your search.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
