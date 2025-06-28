/*-------------------------------------------------------
# External Script File for Product Managment System App #
--------------------------------------------------------*/

/*-------------------------------------------------- 
# Global Scope Variables declarations and definition
---------------------------------------------------*/

/**************************Form Fields Variables**************************/
/* Object that holds all form input fields tags selected from the DOM */
var formInputFields = {
  productNameInputField: document.getElementById("productname"),
  productPriceInputField: document.getElementById("productprice"),
  productCategoryInputField: document.getElementById("productcategory"),
  productImageInputField: document.getElementById("productimage"),
  productDescriptionTextareaField:
    document.getElementById("productdescription"),
  productSearchInputField: document.getElementById("productsearch"),
};
/* Variable to hold row tag selected from the DOM in which products (cols) will be displayed */
var productGallerySpace =
  document.getElementById("product-gallery").children[0].children[0];
/* Variable to hold add button tag selected from the DOM */
var addBtn = document.getElementById("add-btn");
/* Variable to hold update button tag selected from the DOM */
var updateBtn = document.getElementById("update-btn");

/**************************General Variables**************************/
/* List of all registered products */
var productsList = [];
/* List of products key in local storage */
var listOfProductsKey = "list of products";
/* Object that holds all form input fields validation regex patterns */
var inputValidationRegexPatterns = {
  productname: /^[A-Z]\w{1,14}(\s\w{1,14}){0,3}$/,
  productprice: /(^[0]?[6-9][0-9]{3}$)|(^[1-5][0-9]{4}$)|(^60000$)/,
  productcategory: /^(Phones|Screens|Headphones|Watches)$/,
  productimage: /^\w(\w|[^A-Za-z_\.])*(\.(png|jpg|jpeg|svg))$/,
  productdescription: /^(\w|\W){0,250}$/,
};
/* Variable to hold true value for HTML element display */
var showElement = true;
/* Variable to hold false value for HTML element display */
var hideElement = false;
/* Variable to hold true value for form buttons enable */
var enableBtns = true;
/* Variable to hold false value for form buttons disable */
var disableBtns = false;
/* Max size for image in bytes */
var imageMaxSizeInBytes = 100000;

/*=======================================================================================*/

/*--------------------------------------- 
# Functions Definition and Implementation
----------------------------------------*/

/*-----------------------------------------------------------------------------
# Description: A function to set product index for each product based on its
# position on the products list
#------------------------------------------------------------------------------
# @params: 
# @param: listOfProducts (Object) --> Array of products to be sorted based on 
# price
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function setProductsIndexes(listOfProducts) {
  /* Traverse over products list */
  for (var counter = 0; counter < listOfProducts.length; counter++) {
    /* Set product index for each product based on its position on the products list */
    listOfProducts[counter].productIndex = counter;
  }
}

/*-----------------------------------------------------------------------------
# Description: A function to sort list of products based on thier prices 
# (Ascending)
#------------------------------------------------------------------------------
# @params: 
# @param: listOfProducts (Object) --> Array of products to be sorted based on 
# price
#------------------------------------------------------------------------------
# return type: Object
-----------------------------------------------------------------------------*/
function sortListOfProductsBasedOnPrice(listOfProducts) {
  /* Variables declarations and definition */
  var temp = null;
  /* Apply bubble sort on passed array of products and sort based on product price */
  for (var counter1 = 0; counter1 < listOfProducts.length - 1; counter1++) {
    for (
      var counter2 = counter1 + 1;
      counter2 < listOfProducts.length;
      counter2++
    ) {
      if (
        Number(listOfProducts[counter1].productPrice) >
        Number(listOfProducts[counter2].productPrice)
      ) {
        temp = listOfProducts[counter1];
        listOfProducts[counter1] = listOfProducts[counter2];
        listOfProducts[counter2] = temp;
      }
    }
  }
  return listOfProducts;
}

/*-----------------------------------------------------------------------------
# Description: A function to read all product details entered by user to add it 
# to registered product list
#------------------------------------------------------------------------------
# @params: void
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function addProduct() {
  return new Promise((resolve) => {
    /* Variables declarations and definition */
    var product = {
      productName: formInputFields.productNameInputField.value,
      productPrice: formInputFields.productPriceInputField.value,
      productCategory: formInputFields.productCategoryInputField.value,
      productImageName: formInputFields.productImageInputField.files[0].name,
      productImageType: formInputFields.productImageInputField.files[0].type,
      productDescription: formInputFields.productDescriptionTextareaField.value,
    };

    /* Create new instance of FileReader */
    const reader = new FileReader();

    /* Convert file details into base64 string */
    reader.readAsDataURL(formInputFields.productImageInputField.files[0]);

    reader.onload = function (event) {
      /* Assingn returned result to productImage property of product to be added */
      product.productImage = event.target.result;
      /* Push new product to the registered products list */
      productsList.push(product);
      resolve();
    };
  });
}

/*-----------------------------------------------------------------------------
# Description: A function to clear product details of last entered product 
# from input fields after submission
#------------------------------------------------------------------------------
# @params: void
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function clearFormInputFields() {
  /* Clear all form input fields */
  formInputFields.productNameInputField.value = "";
  formInputFields.productPriceInputField.value = "";
  formInputFields.productCategoryInputField.value = "";
  formInputFields.productImageInputField.value = "";
  formInputFields.productDescriptionTextareaField.value = "";
}

/*-----------------------------------------------------------------------------
# Description: A function to display list of registered products after each 
# update 
#------------------------------------------------------------------------------
# @params: 
# @param: listOfProducts (Object) --> Array of products to be displayed
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function displayProducts(listOfProducts) {
  /* Variables declarations and definition */
  blackBox = "";

  /* Check if no passed arrays */
  if (listOfProducts) {
    /* Traverse over list of registered products and display each product card */
    for (var counter = 0; counter < listOfProducts.length; counter++) {
      blackBox += `     
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
              <article class="bg-light p-3 rounded shadow">
                <figure>
                  <img
                    src="${listOfProducts[counter].productImage}"
                    alt="${listOfProducts[counter].productName}"
                    class="w-100 rounded-2"
                  />
                </figure>
                <div class="card-header d-flex justify-content-between mb-3">
                  <span class="d-block badge category-bg-custom p-1"
                    >${listOfProducts[counter].productCategory}</span
                  >
                  <span class="d-block badge bg-success p-1">${
                    listOfProducts[counter].productPrice
                  } EGP</span>
                </div>
                <span class="card-product-name d-block mb-2"
                  >${
                    listOfProducts[counter].productHighlightedName
                      ? listOfProducts[counter].productHighlightedName
                      : listOfProducts[counter].productName
                  }</span
                >
                <p>${listOfProducts[counter].productDescription}</p>
                <div class="d-flex justify-content-between">
                  <button class="btn btn-outline-warning" onclick="editProduct(${
                    listOfProducts[counter].productIndex
                  })">
                    <i class="fa-solid fa-edit"></i>
                  </button>
                  <button class="btn btn-outline-danger" onclick="removeProduct(${
                    listOfProducts[counter].productIndex
                  });searchForElement('${
        formInputFields.productSearchInputField.value
      }')">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </article>
            </div>`;
    }
  } else {
    /* Show "No Products to Display" message */
    blackBox = `    
      <div class="col-12">
        <div class="inner bg-light p-3 rounded">
          <p
            id="no-produuct-msg"
            class="bg-white text-center p-3 m-0 rounded h5"
          >
            No Products to Display
          </p>
        </div>
      </div>`;
  }

  /* Assign blackBox Value to Product Gallery Space */
  productGallerySpace.innerHTML = blackBox;
}

/*-----------------------------------------------------------------------------
# Description: A function to delete a specific product from registered products
# list
#------------------------------------------------------------------------------
# @params: 
# @param: productIndex (Number) --> index of product in registered products
# array
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function deleteProduct(productIndex) {
  /* Remove the product from registered products list */
  productsList.splice(productIndex, 1);
}

/*-----------------------------------------------------------------------------
# Description: A function to create and display a new product to the product 
# gallery on submission 
#------------------------------------------------------------------------------
# @params: void
#------------------------------------------------------------------------------
# return type: Promise (Object)
-----------------------------------------------------------------------------*/
async function createProduct() {
  /* Add new product after submission */
  await addProduct();

  /* Sort the list of products after list update */
  productsList = sortListOfProductsBasedOnPrice(productsList);

  /* Set product indexes after sorting */
  setProductsIndexes(productsList);

  /* Update list on Local Storage */
  updateLocalStorage(listOfProductsKey, productsList);

  /* Clear form input fields after submission */
  clearFormInputFields();

  /* Check if search input field has a search keyword value */
  if (formInputFields.productSearchInputField.value) {
    /* Invoke search function on this value to display matched result */
    searchForElement(formInputFields.productSearchInputField.value);
  } else {
    /* Display list of registered products after submission */
    displayProducts(productsList);
  }

  /* Reset Input Validations */
  resetInputValidtions();

  /* Disable Form Buttons */
  enableFormBtns(disableBtns);
}

/*-----------------------------------------------------------------------------
# Description: A function to remove a product from regisered products list and 
# display updated products list on products gallery section
#------------------------------------------------------------------------------
# @params: 
# @param: productIndex (Number) --> index of product in products array
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function removeProduct(productIndex) {
  /* Remove product from the registered products list */
  deleteProduct(productIndex);

  /* Check if list of products is empty */
  if (productsList.length) {
    /* Set product indexes after sorting */
    setProductsIndexes(productsList);
    /* Update list on Local Storage */
    updateLocalStorage(listOfProductsKey, productsList);
    /* Display list of registered products after product removal */
    displayProducts(productsList);
  } else {
    /* Remove list from local storage */
    removeFromLocalStorage(listOfProductsKey);
    /* Display No Products to display message */
    displayProducts();
  }
}

/*-----------------------------------------------------------------------------
# Description: A function to edit details of a specific product from registered 
# products list
#------------------------------------------------------------------------------
# @params: 
# @param: productIndex (Number) --> index of product in registered products
# array
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function editProduct(productIndex) {
  /* Show details of product to be edited from registered products list on form input fields */
  formInputFields.productNameInputField.value =
    productsList[productIndex].productName;
  formInputFields.productPriceInputField.value =
    productsList[productIndex].productPrice;
  formInputFields.productCategoryInputField.value =
    productsList[productIndex].productCategory;
  formInputFields.productDescriptionTextareaField.value =
    productsList[productIndex].productDescription;

  /* Create new instance of File */
  const myFile = new File(
    [
      base64ToBlob(
        productsList[productIndex].productImage.split(",")[1],
        productsList[productIndex].productImageType
      ),
    ],
    `${productsList[productIndex].productImageName}`,
    {
      type: productsList[productIndex].productImageType,
    }
  );

  /* Create new instance of DataTransfer */
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(myFile);

  /* Assign dataTransfer to files property of image input tag */
  formInputFields.productImageInputField.files = dataTransfer.files;

  /* Validate all form input fields */
  validateFormInputFields();

  /* Show update product button instead of add product button */
  displayElement("add-btn", hideElement);
  displayElement("update-btn", showElement);

  /* Show update product heading instead of add product heading */
  displayElement("add-heading", hideElement);
  displayElement("update-heading", showElement);

  /* Set custom attribute on update button tag that holds the index value of product to be updated */
  updateBtn.setAttribute("product-update-idx", productIndex);
}

/*-----------------------------------------------------------------------------
# Description: A function to save updates on a specific product from registered 
# products list after being edited through updating that product in the list
#------------------------------------------------------------------------------
# @params: void
#------------------------------------------------------------------------------
# return type: Promise (Object)
-----------------------------------------------------------------------------*/
function saveUpdates() {
  return new Promise((resolve) => {
    /* Variables declarations and definition */
    var productIndex = null;
    var product = {
      productName: formInputFields.productNameInputField.value,
      productPrice: formInputFields.productPriceInputField.value,
      productCategory: formInputFields.productCategoryInputField.value,
      productImageName: formInputFields.productImageInputField.files[0].name,
      productImageType: formInputFields.productImageInputField.files[0].type,
      productDescription: formInputFields.productDescriptionTextareaField.value,
    };

    /* Get index value of product to be updated from custom attribute on update button */
    productIndex = updateBtn.getAttribute("product-update-idx");

    /* Create new instance of FileReader */
    const reader = new FileReader();

    /* Convert file details into base64 string */
    reader.readAsDataURL(formInputFields.productImageInputField.files[0]);

    reader.onload = function (event) {
      /* Assign returned result to productImage property of product to be updated */
      product.productImage = event.target.result;
      /* Update product on list */
      productsList[productIndex] = product;
      resolve();
    };
  });
}

/*-----------------------------------------------------------------------------
# Description: A function to update details of a specific product from 
# registered products list after being edited and display changes on products
# gallery
#------------------------------------------------------------------------------
# @params: void
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
async function updateProduct() {
  /* Save Updates */
  await saveUpdates();

  /* Sort the list of products after list update (if needed) */
  productsList = sortListOfProductsBasedOnPrice(productsList);

  /* Set product indexes after sorting (if needed) */
  setProductsIndexes(productsList);

  /* Update Local Storage */
  updateLocalStorage(listOfProductsKey, productsList);

  /* Clear form input fields after submission */
  clearFormInputFields();

  /* Check if search input field has a search keyword value */
  if (formInputFields.productSearchInputField.value) {
    /* Invoke search function on this value to display matched result */
    searchForElement(formInputFields.productSearchInputField.value);
  } else {
    /* Display list of registered products after update */
    displayProducts(productsList);
  }

  /* Reset Input Validations */
  resetInputValidtions();

  /* Show add product button instead of update product button */
  displayElement("add-btn", showElement);
  displayElement("update-btn", hideElement);

  /* Show add product heading instead of update product heading */
  displayElement("add-heading", showElement);
  displayElement("update-heading", hideElement);

  /* Disable Form Buttons */
  enableFormBtns(disableBtns);
}

/*-----------------------------------------------------------------------------
# Description: A function to update local storage with regitered products list
# after each update on that list
#------------------------------------------------------------------------------
# @params: 
# @param1 : key (String) ---> Key value of data to be stored in local storage
# @param2 : value (any) ---> Data to be stored in local storage
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function updateLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/*-----------------------------------------------------------------------------
# Description: A function to retrieve data stored on local storage
#------------------------------------------------------------------------------
# @params: 
# @param : key (String) ---> Key value of data to be retrived from local 
# storage 
#------------------------------------------------------------------------------
# return type: string | null
-----------------------------------------------------------------------------*/
function getFromLocalStorage(key) {
  return localStorage.getItem(key);
}

/*-----------------------------------------------------------------------------
# Description: A function to remove data stored on local storage
#------------------------------------------------------------------------------
# @params: 
# @param : key (String) ---> Key value of data to be removed from local 
# storage 
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function removeFromLocalStorage(key) {
  localStorage.removeItem(key);
}

/*-----------------------------------------------------------------------------
# Description: A function to parse stringified object value to object
#------------------------------------------------------------------------------
# @params: 
# @param : value (String) ---> Value of stringified data to be parsed to object
#------------------------------------------------------------------------------
# return type: object
-----------------------------------------------------------------------------*/
function parseStringToObject(value) {
  return JSON.parse(value);
}

/*-----------------------------------------------------------------------------
# Description: A function to validate data entered by user in form input fields
#------------------------------------------------------------------------------
# @params: 
# @param: inputField (Object) ---> Form Input field on which validaton will be 
# applied
#------------------------------------------------------------------------------
# return type: boolean
-----------------------------------------------------------------------------*/
function validateFormInputField(inputField) {
  /* Variables declarations and definition */
  var isValid = null;
  var imageUploded = null;
  var imageSizeExceeded = null;

  /* Check if input valid is empty */
  if (!inputField.value) {
    if (inputField.type === "file") {
      isValid = false;
      imageUploded = false;
    } else {
      return isValid;
    }
  }

  /* Check type of passed input field */
  if (inputField.type === "file") {
    /* Check if file (i.e. image in our case) is uploaded or not */
    if (inputField.value) {
      /* Validate uploded file if it's an image or not */
      isValid = inputValidationRegexPatterns[inputField.id].test(
        inputField.files[0].name
      );
      imageUploded = true;

      if (isValid && inputField.files[0].size > imageMaxSizeInBytes) {
        imageSizeExceeded = true;
        isValid = false;
      }
    }
  } else {
    /* Validate entered data */
    isValid = inputValidationRegexPatterns[inputField.id].test(
      inputField.value
    );
  }

  /* Identify user if data is valid or not */
  if (isValid) {
    inputField.classList.remove("is-invalid");
    inputField.classList.add("is-valid");
    inputField.nextElementSibling.classList.replace("d-block", "d-none");
    if (inputField.type === "file" && imageUploded) {
      inputField.nextElementSibling.nextElementSibling.classList.replace(
        "d-block",
        "d-none"
      );
      if (!imageSizeExceeded) {
        inputField.nextElementSibling.classList.replace("d-block", "d-none");
        inputField.nextElementSibling.nextElementSibling.nextElementSibling.classList.replace(
          "d-block",
          "d-none"
        );
      }
    }
  } else {
    /* Check type of passed input field, if image is uploaded or not and if uploaded image exceeded maximum size*/
    if (inputField.type === "file" && !imageUploded) {
      inputField.nextElementSibling.classList.replace("d-block", "d-none");
      inputField.nextElementSibling.nextElementSibling.classList.replace(
        "d-none",
        "d-block"
      );
      inputField.nextElementSibling.nextElementSibling.nextElementSibling.classList.replace(
        "d-block",
        "d-none"
      );
    } else if (imageSizeExceeded) {
      inputField.nextElementSibling.classList.replace("d-block", "d-none");
      inputField.nextElementSibling.nextElementSibling.classList.replace(
        "d-block",
        "d-none"
      );
      inputField.nextElementSibling.nextElementSibling.nextElementSibling.classList.replace(
        "d-none",
        "d-block"
      );
    } else {
      if (inputField.type === "file") {
        if (imageUploded) {
          inputField.nextElementSibling.nextElementSibling.classList.replace(
            "d-block",
            "d-none"
          );
        }
        if (!imageSizeExceeded) {
          inputField.nextElementSibling.nextElementSibling.nextElementSibling.classList.replace(
            "d-block",
            "d-none"
          );
        }
      }
      inputField.nextElementSibling.classList.replace("d-none", "d-block");
    }
    inputField.classList.remove("is-valid");
    inputField.classList.add("is-invalid");
  }
  return isValid;
}

/*-----------------------------------------------------------------------------
# Description: A fuction that checks if all input fields are valid 
#------------------------------------------------------------------------------
# @params: void
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function validateFormInputFields() {
  /* Check if products details that are about to be submitted are valid or not */
  if (
    validateFormInputField(formInputFields.productNameInputField) &&
    validateFormInputField(formInputFields.productPriceInputField) &&
    validateFormInputField(formInputFields.productCategoryInputField) &&
    validateFormInputField(formInputFields.productDescriptionTextareaField) &&
    validateFormInputField(formInputFields.productImageInputField)
  ) {
    enableFormBtns(enableBtns);
  } else {
    enableFormBtns(disableBtns);
  }
}

/*-----------------------------------------------------------------------------
# Description: A fuction that enable/disable Add Product and Update Product 
# Buttons
#------------------------------------------------------------------------------
# @params: 
# @param: btnsStatus (Boolean) ---> Status of form buttons 
# (Possible Values : enableBtns, disableBtns)
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function enableFormBtns(btnsStatus) {
  /* Check passed */
  switch (btnsStatus) {
    case enableBtns:
      /* Enable Add Button */
      addBtn.removeAttribute("disabled");
      /* Enable Update Button */
      updateBtn.removeAttribute("disabled");
      break;
    case disableBtns:
      /* Disable Add Button */
      addBtn.setAttribute("disabled", "disabled");
      /* Disable Update Button */
      updateBtn.setAttribute("disabled", "disabled");
      break;
  }
}

/*-----------------------------------------------------------------------------
# Description: A function to reset validations on input field after submission
#------------------------------------------------------------------------------
# @params: void
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function resetInputValidtions() {
  formInputFields.productNameInputField.classList.remove("is-valid");
  formInputFields.productPriceInputField.classList.remove("is-valid");
  formInputFields.productCategoryInputField.classList.remove("is-valid");
  formInputFields.productImageInputField.classList.remove("is-valid");
  formInputFields.productDescriptionTextareaField.classList.remove("is-valid");
}

/*-----------------------------------------------------------------------------
# Description: A function to display (show/hide) an HTML element by id
#------------------------------------------------------------------------------
# @params: 
# @param1: elementId (Number) ---> Id of element
# @param2: elementStatus (Boolean) ---> Status of element 
# (Possible Values : showElement, hideElement)
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function displayElement(elementId, elementStatus) {
  /* Variables declarations and definition */
  var element = document.getElementById(`${elementId}`);

  /* Check element status */
  switch (elementStatus) {
    case showElement:
      element.classList.remove("d-none");
      break;
    case hideElement:
      element.classList.add("d-none");
      break;
  }
}

/*-----------------------------------------------------------------------------
# Description: A fuction that gets all products from registered products list
# that are matched with passed search keyword to search input field
#------------------------------------------------------------------------------
# @params: 
# @param: searchInputFieldValue (String) ---> Search keyword passed by the user 
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function searchForElement(searchInputFieldValue) {
  /* Variables declarations and definition */
  var searchKeyword = "";
  var searchMatchedProducts = [];

  /* Get the search keyword passed by the user*/
  searchKeyword = searchInputFieldValue;

  /* Check if user has passed any search keyword */
  if (searchKeyword) {
    /* Traverse over productsList array */
    for (var counter = 0; counter < productsList.length; counter++) {
      /* Check if passed keyword is matched with any of products names */
      if (
        productsList[counter].productName
          .toLowerCase()
          .includes(searchKeyword.toLowerCase())
      ) {
        /* Create new instance of regex based on passed search keyword */
        var regex = new RegExp(searchKeyword, "gi");

        /* Highlight matched substrings with search keyword of matched products names  */
        productsList[counter].productHighlightedName = productsList[
          counter
        ].productName.replace(regex, (matchedValue) => {
          return `<span style="color:red;">${matchedValue}</span>`;
        });

        /* Push the matched product to search matched products list */
        searchMatchedProducts.push(productsList[counter]);

        /* Display Matched Products */
        displayProducts(searchMatchedProducts);
      }
    }
    if (!searchMatchedProducts.length) {
      /* Display "No Products to Display" message */
      displayProducts();
    }
  } else {
    /* Remove any product name highlighted substrings caused by search (if any) */
    for (var counter = 0; counter < productsList.length; counter++) {
      productsList[counter].productHighlightedName = "";
    }
    /* Display list of registered products */
    displayProducts(productsList);
  }
}
/*-----------------------------------------------------------------------------
# Description: A fuction that converts base64 String to a Blob
#------------------------------------------------------------------------------
# @params: 
# @param1: base64String (base64) --> base64 string to be converted to a Blob
# @param2: fileType (String) --> Type of returned Blob
#------------------------------------------------------------------------------
# return type: void
-----------------------------------------------------------------------------*/
function base64ToBlob(base64String, blobType) {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: blobType });
  return blob;
}
/*=======================================================================================*/

/*--------------------------------------- 
# App Entry Point
----------------------------------------*/

/* Check if there are any products stored in local storage */
if (getFromLocalStorage(listOfProductsKey)) {
  /* Get products stored in local storage */
  productsList = parseStringToObject(getFromLocalStorage(listOfProductsKey));
  /* Remove any product name highlighted substrings caused by search (if any) */
  for (var counter = 0; counter < productsList.length; counter++) {
    productsList[counter].productHighlightedName = "";
  }
  /* Display previously added products if any from local storage */
  displayProducts(productsList);
} else {
  /* Display "No Products to Display" message */
  displayProducts();
}
