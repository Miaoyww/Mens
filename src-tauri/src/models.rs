use serde::{Deserialize, Serialize};

// ── Dish models ────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Dish {
    pub id: String,
    pub name: String,
    pub price: f64,
    pub image: String,
    pub discount: f64,
    pub category: String, // "cold" | "hot" | "soup"
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DishCreate {
    pub name: String,
    /// Price as a string from the form input (e.g. "18.00").
    /// Will be parsed to f64 before inserting.
    pub price: String,
    pub image: String,
    pub category: String,
    #[serde(default = "default_discount")]
    pub discount: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DishUpdate {
    pub name: Option<String>,
    /// Price as a string from the form input.
    pub price: Option<String>,
    pub image: Option<String>,
    pub category: Option<String>,
    pub discount: Option<f64>,
}

fn default_discount() -> f64 {
    1.0
}

impl DishCreate {
    /// Parse the string price to f64. Returns an error if parsing fails.
    pub fn parse_price(&self) -> Result<f64, String> {
        self.price
            .parse::<f64>()
            .map_err(|_| format!("无效的价格: {}", self.price))
    }
}

impl DishUpdate {
    pub fn parse_price(&self) -> Option<Result<f64, String>> {
        self.price
            .as_ref()
            .map(|p| p.parse::<f64>().map_err(|_| format!("无效的价格: {}", p)))
    }
}
