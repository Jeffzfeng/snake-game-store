var storeFrontAPI = "https://snake-game-store.myshopify.com/api/graphql";
var storeFrontAccessToken = "b3d3605b74d0def71ac2c6fcf90d4353";

// Sets up the GraphQL request headers
function makeRequest(query) {
  var headers = {
    "X-Shopify-Storefront-Access-Token": storeFrontAccessToken,
    "Content-Type": "application/json"
  };

  return $.ajax({
    url: storeFrontAPI,
    type: "POST",
    data: JSON.stringify({ query: query }),
    headers: headers
  });
}

// Queries for product information
function fetchProducts() {
  var query = `
  query {
      shop {
        products(first: 4) {
          edges {
            node {
              images (first: 1) {
                edges {
                  node {
                    src
                  }
                }
              }
              variants (first: 1) {
                edges {
                  node {
                    id
                  }
                }
              } 
            }
          }
        }
      }
    }
 `;

  return makeRequest(query);
}

// // Buys new power up by creating new checkout with item
function buyPowerUp(variantId) {
  var query = `
    mutation {
      checkoutCreate(input: {
        lineItems: [{
            quantity: 1,
            variantId: "${variantId}"
          }]
        }) {
          checkout {
            webUrl
            completedAt
            id
          }
        }
      }
    `;

  return makeRequest(query);
}

// Checks completed purchases by querying checkouts with `completedAt` value
function checkCompletedPurchases(checkoutIds) {
  var query = `
      query {
        nodes(ids: [${checkoutIds}]) {
          ... on Checkout {
            id
            completedAt
            lineItems(first: 3) {
              edges {
                node {
                  variant {
                    id
                    product {
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

  return makeRequest(query);
}
