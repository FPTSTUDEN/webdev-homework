const API_BASE_URL = "https://media2.edu.metropolia.fi/restaurant/api/v1";

export const RESTAURANT_LIST_URL = `${API_BASE_URL}/restaurants`;
export const DAILY_MENU_URL = restaurantId =>
  `${API_BASE_URL}/restaurants/daily/${encodeURIComponent(restaurantId)}/en`;
export const WEEKLY_MENU_URL = restaurantId =>
  `${API_BASE_URL}/restaurants/weekly/${encodeURIComponent(restaurantId)}/en`;
