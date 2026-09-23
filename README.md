# ProductHub Frontend

ProductHub is a React-based frontend for a product management and shopping application. It provides separate functionality for customers and sellers while allowing sellers to also purchase products as customers.

## Features

### Customer

- Register and login
- View available products
- View product details
- Add products to cart
- Update cart quantities
- Remove products from cart
- Purchase products

### Seller

- Register and login
- View products
- Add products
- Edit and update products
- Delete products
- Manage seller products
- Purchase products like a customer

## Tech Stack

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

## Application Structure

The frontend is organized into reusable components and pages.

```text
src/
├── components/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ProductList.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   ├── AddProduct.jsx
│   └── Seller.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Application Flow

```text
User / Seller
      |
      v
Authentication
      |
      v
Product Listing
      |
      +------------------+
      |                  |
      v                  v
View Products       Seller Management
      |                  |
      v                  +-- Add Product
   Product               +-- Edit Product
   Details               +-- Update Product
      |                  +-- Delete Product
      v
     Cart
      |
      v
   Purchase
```

## Frontend and Backend

The frontend communicates with the ProductHub backend through REST APIs.

The backend handles:

- Authentication
- User and seller authorization
- Product management
- Cart operations
- Purchasing
- Database operations

The frontend is responsible for displaying the application interface and interacting with these APIs.

## Authentication

The application uses JWT-based authentication provided by the backend.

After successful registration or login, the frontend receives an access token and uses it when accessing protected backend resources.

User roles determine the functionality available within the application.

## Running Locally

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-FRONTEND-REPOSITORY.git
```

Navigate to the project:

```bash
cd my-new-app
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at the local URL provided by Vite.

## Environment Variables

If the frontend uses environment variables, create a `.env` file for local configuration.

For example:

```env
VITE_API_URL=your_backend_api_url
```

Do not commit `.env` files or sensitive credentials to GitHub.

## Author

**Rinufathima**

GitHub: https://github.com/rinufathima-doc

## License

This project was developed for learning and development purposes.
