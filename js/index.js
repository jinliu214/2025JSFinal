// 產品區塊
// [v] 瀏覽產品列表
// [v] 篩選產品
// [v] 加入購物車：將事件綁定在整個產品列表上，提升效能

// 購物車區塊
//  確認購物車列表
//   [v] 瀏覽購物車內容
//  編輯 / 刪除購物車
//   [v] 刪除單一商品
//   [v] 刪除所有品項

// 訂單區塊
//  驗證內容：先在前端進行驗證，通過後再送出訂單，減少資源耗費
//   [v] 檢查購物車有無商品
//   [v] 檢查表單欄位是否有填寫
//   [v] 送出訂單
//   [v] 送出後清空表單

const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1/customer/";
const apiPath = "jinliu";
const productApiUrl = `${baseUrl}${apiPath}/products`;
const cartApiUrl = `${baseUrl}${apiPath}/carts`;
const ordersApiUrl = `${baseUrl}${apiPath}/orders`;

let products = [];
let carts = [];
let finalTotal = 0;

const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const shoppingCartTableBody = document.querySelector(
  ".shoppingCart-table tbody"
);
const shoppingCartTotal = document.querySelector(".total");
const discardAllBtn = document.querySelector(".discardAllBtn");
const orderInfoBtn = document.querySelector(".orderInfo-btn");
const customerName = document.querySelector("#customerName");
const customerPhone = document.querySelector("#customerPhone");
const customerEmail = document.querySelector("#customerEmail");
const customerAddress = document.querySelector("#customerAddress");
const tradeWay = document.querySelector("#tradeWay");
const orderInfoForm = document.querySelector(".orderInfo-form");

orderInfoBtn.addEventListener("click", function (e) {
  e.preventDefault();
  customerName.nextElementSibling.style.display = "none";
  customerPhone.nextElementSibling.style.display = "none";
  customerEmail.nextElementSibling.style.display = "none";
  customerAddress.nextElementSibling.style.display = "none";

  const name = customerName.value.trim();
  const tel = customerPhone.value.trim();
  const email = customerEmail.value.trim();
  const address = customerAddress.value.trim();
  const payment = tradeWay.value;

  let isError = false;
  if (!name) {
    console.log("請輸入姓名");
    customerName.nextElementSibling.style.display = "block";
    isError = true;
  }
  if (!tel) {
    customerPhone.nextElementSibling.style.display = "block";
    isError = true;
  }
  if (!email) {
    customerEmail.nextElementSibling.style.display = "block";
    isError = true;
  }
  if (!address) {
    customerAddress.nextElementSibling.style.display = "block";
    isError = true;
  }
  if (!isError) {
    const formData = {
      data: {
        user: {
          name,
          tel,
          email,
          address,
          payment,
        },
      },
    };
    submitOrder(formData);
  }
});

shoppingCartTableBody.addEventListener("click", function (e) {
  e.preventDefault();
  const id = e.target.dataset.id;
  if (id) {
    deleteCart(id);
  }
});

discardAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  deleteCarts();
});

productWrap.addEventListener("click", function (e) {
  e.preventDefault();
  const id = e.target.dataset.id;
  if (id) {
    addCart(id);
  }
});

//篩選產品
productSelect.addEventListener("change", function () {
  if (productSelect.value === "全部") {
    renderProducts(products);
  } else {
    let filterProducts = [];
    products.forEach(function (product) {
      if (product.category === productSelect.value) {
        filterProducts.push(product);
      }
    });
    renderProducts(filterProducts);
  }
});

//渲染購物車列表
function renderCarts() {
  let cartList = "";
  carts.forEach(function (item) {
    cartList += ` <tr>
              <td>
                <div class="cardItem-title">
                  <img src="${item.product.images}" alt="" />
                  <p>${item.product.title}</p>
                </div>
              </td>
              <td>NT$${item.product.origin_price}</td>
              <td>${item.quantity}</td>
              <td>NT$${item.product.price}</td>
              <td class="discardBtn">
                <a href="#" class="material-icons" data-id="${item.id}"> clear </a>
              </td>
            </tr>`;
  });
  shoppingCartTableBody.innerHTML = cartList;
  shoppingCartTotal.textContent = `NT$${finalTotal}`;

  if (!carts.length) {
    orderInfoBtn.setAttribute("disabled", "true");
  } else {
    orderInfoBtn.removeAttribute("disabled");
  }
}
//渲染產品列表
function renderProducts(data) {
  let productList = "";
  data.forEach(function (product) {
    productList += `
    <li class="productCard">
          <h4 class="productType">新品</h4>
          <img
            src="${product.images}"
            alt=""
          />
          <a href="#" class="addCardBtn" data-id="${product.id}">加入購物車</a>
          <h3>${product.title}</h3>
          <del class="originPrice">NT$${product.origin_price}</del>
          <p class="nowPrice">NT$${product.price}</p>
        </li>
    `;
  });
  productWrap.innerHTML = productList;
}
//取得產品列表
const getProducts = async () => {
  try {
    const response = await axios.get(productApiUrl);
    products = response.data.products;
    renderProducts(products);
  } catch (error) {
    console.log(error.response?.data?.message || error.message);
  }
};

//取得購物車列表
const getCarts = async () => {
  try {
    const response = await axios.get(cartApiUrl);
    carts = response.data.carts;
    finalTotal = response.data.finalTotal;

    renderCarts();
  } catch (error) {
    console.log(error.response?.data?.message || error.message);
  }
};

//加入購物車
function addCart(id) {
  const data = {
    data: {
      productId: id,
      quantity: 1,
    },
  };
  axios
    .post(cartApiUrl, data)
    .then(function (response) {
      carts = response.data.carts;
      finalTotal = response.data.finalTotal;
      renderCarts();
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error.response?.data?.message || error.message);
    });
}

//刪除購物車所有品項
function deleteCarts() {
  axios
    .delete(cartApiUrl)
    .then(function (response) {
      carts = response.data.carts;
      finalTotal = response.data.finalTotal;
      renderCarts();
    })
    .catch(function (error) {
      console.log(error.response?.data?.message || error.message);
    });
}

//刪除購物車單一產品
function deleteCart(id) {
  axios
    .delete(`${cartApiUrl}/${id}`)
    .then(function (response) {
      carts = response.data.carts;
      finalTotal = response.data.finalTotal;
      renderCarts();
    })
    .catch(function (error) {
      console.log(error.response?.data?.message || error.message);
    });
}

//送出訂單
function submitOrder(formData) {
  axios
    .post(ordersApiUrl, formData)
    .then(function (response) {
      console.log(response.data);
      orderInfoForm.reset();
      getCarts();
    })
    .catch(function (error) {
      console.log(error.response?.data?.message || error.message);
    });
}
function init() {
  getProducts();
  getCarts();
}

init();
