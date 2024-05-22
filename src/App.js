import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports.js';

Amplify.configure(awsmobile);

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [zipcode, setZipcode] = useState('');
  const [flavorProfile, setFlavorProfile] = useState('');
  const [allergies, setAllergies] = useState('');
  const [honeyList, setHoneyList] = useState([
    {
      "name": "Golden Blossom",
      "ingredients": ["Clover Honey", "Wildflower Honey"],
      "description": "A harmonious blend of clover and wildflower honeys, perfect for sweetening tea and desserts."
    },
    {
      "name": "Citrus Zest",
      "ingredients": ["Orange Blossom Honey", "Lemon Zest"],
      "description": "Bright and tangy, this honey is infused with lemon zest for a refreshing twist."
    },
    {
      "name": "Lavender Dream",
      "ingredients": ["Lavender Honey", "Vanilla Bean"],
      "description": "Calming lavender honey paired with the warmth of vanilla bean, ideal for relaxation."
    },
    {
      "name": "Spiced Autumn",
      "ingredients": ["Cinnamon Honey", "Nutmeg", "Allspice"],
      "description": "A cozy blend of cinnamon, nutmeg, and allspice, reminiscent of autumn."
    },
    {
      "name": "Berry Burst",
      "ingredients": ["Blueberry Honey", "Raspberry Extract"],
      "description": "A vibrant mix of blueberry honey and raspberry extract, great for toast and yogurt."
    },
    {
      "name": "Tropical Paradise",
      "ingredients": ["Mango Honey", "Pineapple Juice"],
      "description": "Exotic mango honey with a splash of pineapple juice, transporting you to a tropical getaway."
    },
    {
      "name": "Minty Fresh",
      "ingredients": ["Peppermint Honey", "Spearmint Leaves"],
      "description": "Refreshing peppermint honey with a hint of spearmint, perfect for beverages."
    },
    {
      "name": "Ginger Spice",
      "ingredients": ["Ginger Honey", "Turmeric"],
      "description": "Zesty ginger honey combined with the earthiness of turmeric, great for wellness teas."
    },
    {
      "name": "Maple Delight",
      "ingredients": ["Maple Honey", "Pecan Extract"],
      "description": "Rich maple honey infused with pecan extract, ideal for pancakes and waffles."
    },
    {
      "name": "Cocoa Bliss",
      "ingredients": ["Chocolate Honey", "Cocoa Nibs"],
      "description": "Decadent chocolate honey mixed with crunchy cocoa nibs, perfect for drizzling on desserts."
    },
    {
      "name": "Vanilla Bean",
      "ingredients": ["Vanilla Honey", "Vanilla Extract"],
      "description": "Classic vanilla honey enhanced with vanilla extract for an extra creamy flavor."
    },
    {
      "name": "Herbal Harmony",
      "ingredients": ["Sage Honey", "Thyme"],
      "description": "A savory blend of sage honey and thyme, perfect for culinary uses."
    },
    {
      "name": "Floral Symphony",
      "ingredients": ["Rose Honey", "Jasmine"],
      "description": "A fragrant combination of rose and jasmine honeys, ideal for teas and desserts."
    },
    {
      "name": "Nutty Nectar",
      "ingredients": ["Almond Honey", "Hazelnut Extract"],
      "description": "Sweet almond honey paired with nutty hazelnut extract, great for spreads and baking."
    },
    {
      "name": "Caramel Kiss",
      "ingredients": ["Caramel Honey", "Sea Salt"],
      "description": "Rich caramel honey with a touch of sea salt, perfect for drizzling over ice cream."
    },
    {
      "name": "Cranberry Spice",
      "ingredients": ["Cranberry Honey", "Cinnamon"],
      "description": "Tart cranberry honey with a hint of cinnamon, great for holiday dishes."
    },
    {
      "name": "Chai Delight",
      "ingredients": ["Chai Honey", "Cardamom"],
      "description": "Warm chai honey blended with aromatic cardamom, ideal for tea lovers."
    },
    {
      "name": "Lemon Thyme",
      "ingredients": ["Lemon Honey", "Thyme"],
      "description": "Zesty lemon honey combined with fresh thyme, perfect for marinades and salads."
    },
    {
      "name": "Apple Spice",
      "ingredients": ["Apple Honey", "Cinnamon"],
      "description": "Sweet apple honey with a touch of cinnamon, great for baking and oatmeal."
    },
    {
      "name": "Rosemary Bliss",
      "ingredients": ["Rosemary Honey", "Lavender"],
      "description": "Aromatic rosemary honey blended with calming lavender, ideal for culinary uses."
    },
    {
      "name": "Peachy Keen",
      "ingredients": ["Peach Honey", "Vanilla"],
      "description": "Sweet peach honey with a hint of vanilla, perfect for summer desserts."
    },
    {
      "name": "Pumpkin Spice",
      "ingredients": ["Pumpkin Honey", "Spice Blend"],
      "description": "Seasonal pumpkin honey with a blend of warm spices, great for fall recipes."
    },
    {
      "name": "Berry Medley",
      "ingredients": ["Strawberry Honey", "Blueberry"],
      "description": "A delightful mix of strawberry and blueberry honeys, perfect for breakfast spreads."
    },
    {
      "name": "Eucalyptus Cool",
      "ingredients": ["Eucalyptus Honey", "Peppermint"],
      "description": "Refreshing eucalyptus honey with a hint of peppermint, great for soothing teas."
    },
    {
      "name": "Fig Delight",
      "ingredients": ["Fig Honey", "Almond"],
      "description": "Sweet fig honey paired with nutty almond, ideal for cheese boards."
    },
    {
      "name": "Zesty Ginger",
      "ingredients": ["Ginger Honey", "Lemon"],
      "description": "Spicy ginger honey with a touch of lemon, perfect for teas and marinades."
    },
    {
      "name": "Berry Bliss",
      "ingredients": ["Raspberry Honey", "Blackberry"],
      "description": "A rich blend of raspberry and blackberry honeys, great for desserts and smoothies."
    },
    {
      "name": "Coconut Dream",
      "ingredients": ["Coconut Honey", "Vanilla"],
      "description": "Creamy coconut honey with a hint of vanilla, perfect for tropical dishes."
    },
    {
      "name": "Chili Heat",
      "ingredients": ["Spicy Honey", "Chili Flakes"],
      "description": "Hot and spicy honey infused with chili flakes, great for adding a kick to dishes."
    },
    {
      "name": "Pineapple Twist",
      "ingredients": ["Pineapple Honey", "Coconut"],
      "description": "Tropical pineapple honey with a touch of coconut, perfect for summer drinks."
    },
    {
      "name": "Rose Petal",
      "ingredients": ["Rose Honey", "Rose Petals"],
      "description": "Delicate rose honey with real rose petals, ideal for gourmet dishes."
    },
    {
      "name": "Maple Pecan",
      "ingredients": ["Maple Honey", "Pecan"],
      "description": "Rich maple honey with crunchy pecans, perfect for breakfast and desserts."
    },
    {
      "name": "Cinnamon Roll",
      "ingredients": ["Cinnamon Honey", "Vanilla"],
      "description": "Sweet cinnamon honey with a hint of vanilla, reminiscent of fresh cinnamon rolls."
    },
    {
      "name": "Berry Delight",
      "ingredients": ["Mixed Berry Honey", "Lemon"],
      "description": "A vibrant mix of berries with a touch of lemon, great for a refreshing twist."
    },
    {
      "name": "Lime Zest",
      "ingredients": ["Lime Honey", "Mint"],
      "description": "Zesty lime honey with a hint of mint, perfect for drinks and desserts."
    },
    {
      "name": "Coffee Bliss",
      "ingredients": ["Coffee Honey", "Vanilla"],
      "description": "Rich coffee honey with a touch of vanilla, ideal for morning spreads."
    },
    {
      "name": "Vanilla Spice",
      "ingredients": ["Vanilla Honey", "Nutmeg"],
      "description": "Creamy vanilla honey with a hint of nutmeg, perfect for baking."
    },
    {
      "name": "Cherry Blossom",
      "ingredients": ["Cherry Honey", "Blossom Extract"],
      "description": "Sweet cherry honey with a floral touch, ideal for gourmet dishes."
    },
    {
      "name": "Lavender Lemon",
      "ingredients": ["Lavender Honey", "Lemon"],
      "description": "Calming lavender honey with a zesty lemon twist, perfect for teas."
    },
    {
      "name": "Almond Joy",
      "ingredients": ["Almond Honey", "Coconut"],
      "description": "Sweet almond honey with a touch of coconut, great for snacks."
    },
    {
      "name": "Orange Spice",
      "ingredients": ["Orange Honey", "Cinnamon"],
      "description": "Bright orange honey with a hint of cinnamon, perfect for holiday dishes."
    },
    {
      "name": "Lemon Basil",
      "ingredients": ["Lemon Honey", "Basil"],
      "description": "Zesty lemon honey with fresh basil, ideal for culinary uses."
    },
    {
      "name": "Honeydew Delight",
      "ingredients": ["Honeydew Honey", "Mint"],
      "description": "Sweet honeydew honey with a hint of mint, perfect for refreshing dishes."
    }
  ]);
  const [randomHoney, setRandomHoney] = useState(null);
  const [showRandomHoney, setShowRandomHoney] = useState(false); // State to control rendering of random honey

  const getRandomHoney = () => {
    const randomIndex = Math.floor(Math.random() * honeyList.length);
    setRandomHoney(honeyList[randomIndex]);
  };

  useEffect(() => {
    // Fetch honey list when component mounts
    async function fetchHoneyList() {
      try {
        const response = await fetch('/honey.json'); // Assuming the JSON file is served from the public directory
        if (!response.ok) {
          throw new Error('Failed to fetch honey list');
        }
        const data = await response.json();
        setHoneyList(data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchHoneyList();
  }, []);

  const invokeLambda = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = {
        zipcode: zipcode,
        flavorProfile: flavorProfile,
        allergies: allergies
      };

      const response = await fetch('http://127.0.0.1:8000/invoke', { // Update URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to trigger Lambda function');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickRandomHoney = () => {
    const randomIndex = Math.floor(Math.random() * honeyList.length);
    return honeyList[randomIndex];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Once form is submitted successfully, set random honey state and show random honey
    setRandomHoney(pickRandomHoney());
    setShowRandomHoney(true);
  };

  const checkFlagState = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check flag state code here
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundImage: "url(/img.png)" }}>
      <header className="App-header">
        <h1>MyHoney</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="zipcode">
            Zipcode:
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
            />
          </label>
          <br />
          <label htmlFor="flavorProfile">
            Flavor Profile:
            <select
              id="flavorProfile"
              name="flavorProfile"
              value={flavorProfile}
              onChange={(e) => setFlavorProfile(e.target.value)}
            >
              <option value="">Select Flavor Profile</option>
              <option value="Sweet">Sweet</option>
              <option value="Tangy">Tangy</option>
              <option value="Spicy">Spicy</option>
            </select>
          </label>
          <br />
          <label htmlFor="allergies">
            Allergies:
            <select
              id="allergies"
              name="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            >
              <option value="">Select Allergies</option>
              <option value="None">None</option>
              <option value="Seasonal">Peanuts</option>
              <option value="Rhinitis">Dairy</option>
              <option value="Skin Allergies">Gluten</option>
              <option value="Sore Throat">Dairy</option>
            </select>
          </label>
          <br />
          <button type="submit">
            Submit
          </button>
        </form>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {showRandomHoney && randomHoney && (
          <div>
            <h2>{randomHoney.name}</h2>
            <p>Ingredients: {randomHoney.ingredients.join(', ')}</p>
            <p>{randomHoney.description}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
