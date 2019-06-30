const DOM_ELEM = {
  outProduct: document.getElementById('out-product'),
  nameProduct: document.getElementById('name-product'),
  idProduct: document.getElementById('id-product'),
  priceProduct: document.getElementById('price-product'),
  descriptionProduct: document.getElementById('description-product'),
  addButton: document.getElementById('add')
}

let arrayListProduct = [];

function localStorageSetItem(arr) {
  localStorage.setItem('listProduct', JSON.stringify(arr));
}

function loadLocalStorage() {
  if (localStorage.getItem('listProduct') != undefined) {
    arrayListProduct = JSON.parse(localStorage.getItem('listProduct'));

    for (let key in arrayListProduct) {
      let listProduct = createNewElement(arrayListProduct[key]);
      DOM_ELEM.outProduct.appendChild(listProduct);
    }

    bindProductEvents();
  }
}

loadLocalStorage();

function createNewElement(product) {
  let newProductItem = document.createElement('tr');
  newProductItem.className = "row product-item";
  newProductItem.innerHTML = `
    <td class="col-3 product-item__neme">${product.name}</td>
    <td class="col-1 product-item__id">${product.id}</td>
    <td class="col-1 product-item__price">${product.price}</td>
    <td class="col-5 product-item__description">${product.description}</td>
    <td class="col-1 product-item__edit"><button class="btn btn-product-edit" data-toggle="modal" data-target="#modalEdit"><i class="fas fa-edit"></i></button></td>
    <td class="col-1 product-item__delete"><button class="btn btn-product-delete"><i class="fas fa-trash-alt"></i></button></td>`;

  return newProductItem;
}

function addProduct(e) {
  let name = DOM_ELEM.nameProduct.value,
    id = DOM_ELEM.idProduct.value,
    price = DOM_ELEM.priceProduct.value,
    description = DOM_ELEM.descriptionProduct.value;

  if (validateInput(e)) {
    let listProduct = createNewElement({ name, id, price, description });
    DOM_ELEM.outProduct.appendChild(listProduct);

    arrayListProduct.push({ name, id, price, description });
    localStorageSetItem(arrayListProduct);
    bindProductEvents();
  }

}
DOM_ELEM.addButton.onclick = (e) => addProduct(e);

document.querySelector('[data-target="#modalAdd"]').onclick = function () {
  cleaningOfField();
};

function editProduct(e, key) {

  cleaningOfField();

  let defaultName = e.parentNode.parentNode.querySelector('.product-item__neme');
  let defaultId = e.parentNode.parentNode.querySelector('.product-item__id');
  let defaultPrice = e.parentNode.parentNode.querySelector('.product-item__price');
  let defaultDescription = e.parentNode.parentNode.querySelector('.product-item__description');

  const DOM_EDIT_ELEM = {
    editButton: document.getElementById('edit'),
    editNameProduct: document.getElementById('edit-name-product'),
    editIdProduct: document.getElementById('edit-id-product'),
    editPriceProduct: document.getElementById('edit-price-product'),
    editDescriptionProduct: document.getElementById('edit-description-product')
  }

  DOM_EDIT_ELEM.editNameProduct.value = defaultName.textContent;
  DOM_EDIT_ELEM.editIdProduct.value = defaultId.textContent;
  DOM_EDIT_ELEM.editPriceProduct.value = defaultPrice.textContent;
  DOM_EDIT_ELEM.editDescriptionProduct.value = defaultDescription.textContent;

  DOM_EDIT_ELEM.editButton.onclick = function (e) {

    if (validateInput(e)) {
      defaultName.innerHTML = DOM_EDIT_ELEM.editNameProduct.value;
      defaultId.innerHTML = DOM_EDIT_ELEM.editIdProduct.value;
      defaultPrice.innerHTML = DOM_EDIT_ELEM.editPriceProduct.value;
      defaultDescription.innerHTML = DOM_EDIT_ELEM.editDescriptionProduct.value;

      arrayListProduct[key] = {}
      arrayListProduct[key] = {
        name: DOM_EDIT_ELEM.editNameProduct.value,
        id: DOM_EDIT_ELEM.editIdProduct.value,
        price: DOM_EDIT_ELEM.editPriceProduct.value,
        description: DOM_EDIT_ELEM.editDescriptionProduct.value
      };

      localStorageSetItem(arrayListProduct);
      bindProductEvents();
    }
  }

}

function deleteProduct(e, key) {
  let productList = e.parentNode.parentNode;
  let tbody = productList.parentNode;
  tbody.removeChild(productList);

  arrayListProduct[key] = {};
  let filterListProduct = arrayListProduct.filter(value => Object.keys(value).length !== 0);
  arrayListProduct = filterListProduct;

  localStorageSetItem(filterListProduct);
  bindProductEvents();
}

function bindProductEvents() {
  const DOM_CR_ELEM = {
    editProductButton: document.querySelectorAll('.btn-product-edit'),
    deleteProductButton: document.querySelectorAll('.btn-product-delete')
  }

  DOM_CR_ELEM.editProductButton.forEach((e, key) => e.onclick = () => editProduct(e, key));
  DOM_CR_ELEM.deleteProductButton.forEach((e, key) => e.onclick = () => deleteProduct(e, key));
}

function validateInput(buttonEvent) {
  let validCheck = 0;

  let inputElem = buttonEvent.target.offsetParent.children[1].firstElementChild;

  for (let i = 0; i < inputElem.length; i++) {
    if (inputElem[i].value == '') {
      inputElem[i].classList.add('invalid');
      validCheck -= 1;
    }
  }

  if (validCheck) {
    buttonEvent.target.dataset.dismiss = '';
  } else {
    buttonEvent.target.dataset.dismiss = 'modal';
    return true;
  }

}

function cleaningOfField() {
  document.querySelectorAll('[name="field"]').forEach(function (e) {
    e.classList.remove('invalid');
    e.onclick = (e) => {
      e.target.classList.remove('invalid');
    }
    e.value = '';
  });
}



