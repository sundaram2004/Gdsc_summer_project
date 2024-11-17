import RestaurantModel from "../models/restaurantModel.js";

export const createPromotion = async (req, res) => {
    const { restaurantId } = req.params;
    const { title, description, discountPercentage, startDate, endDate } = req.body;
  
    try {
      const restaurant = await RestaurantModel.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).send('Restaurant not found');
      }
  
      const newPromotion = {
        title,
        description,
        discountPercentage,
        startDate,
        endDate,
        active: true,
      };
  
      restaurant.promotions.push(newPromotion);
      await restaurant.save();
  
      res.status(201).json(newPromotion);
    } catch (error) {
      res.status(500).send('Server error');
    }
  };
  
  export const getPromotions = async (req, res) => {
    const { restaurantId } = req.params;
  
    try {
      const restaurant = await RestaurantModel.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).send('Restaurant not found');
      }
  
      res.status(200).json(restaurant.promotions);
    } catch (error) {
      res.status(500).send('Server error');
    }
  };
  
  export const updatePromotion = async (req, res) => {
    const { restaurantId, promotionId } = req.params;
    const { title, description, discountPercentage, startDate, endDate, active } = req.body;
  
    try {
      const restaurant = await RestaurantModel.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).send('Restaurant not found');
      }
  
      const promotion = restaurant.promotions.id(promotionId);
      if (!promotion) {
        return res.status(404).send('Promotion not found');
      }
  
      promotion.title = title || promotion.title;
      promotion.description = description || promotion.description;
      promotion.discountPercentage = discountPercentage || promotion.discountPercentage;
      promotion.startDate = startDate || promotion.startDate;
      promotion.endDate = endDate || promotion.endDate;
      promotion.active = active !== undefined ? active : promotion.active;
  
      await restaurant.save();
  
      res.status(200).json(promotion);
    } catch (error) {
      res.status(500).send('Server error');
    }
  };
  
  export const deletePromotion = async (req, res) => {
    const { restaurantId, promotionId } = req.params;
  
    try {
      // Find the restaurant by its ID
      const restaurant = await RestaurantModel.findById(restaurantId);
  
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      // Remove the promotion from the promotions array
      restaurant.promotions = restaurant.promotions.filter(
        promotion => promotion._id.toString() !== promotionId
      );
  
      // Save the restaurant document
      await restaurant.save();
  
      res.status(200).json({ message: 'Promotion removed successfully', restaurant });
    } catch (error) {
      res.status(500).json({ message: 'Error removing promotion', error: error.message });
    }
  };
  
  

  export const getPromotionById = async (req, res) => {
    const { restaurantId, promotionId } = req.params; // Assuming you have restaurantId as well to identify the restaurant
  
    try {
      const restaurant = await RestaurantModel.findById(restaurantId);
  
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      const promotion = restaurant.promotions.id(promotionId);
  
      if (!promotion) {
        return res.status(404).json({ message: 'Promotion not found' });
      }
  
      res.status(200).json(promotion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };