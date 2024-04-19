//! Gerekli HTML elementlerini sectik.
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

//* duzenleme secenekleri olusturduk
let editElement;
let editFlag = false; //duzenleme modunda olup olmadigini belirtir.
let editID = ""; //duzenleme yapilan ogenin benzersiz kimligi

//!Fonksiyonlar
const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Ekle";
};

const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};

const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement; //article etiketine eristik.
  const id = element.dataset.id;
  list.removeChild(element); //list etiketinden article etiketini kaldirdik.
  displayAlert("Öge kaldirildi", "danger");
  setBackToDefault();
};

const addItem = (e) => {
  e.preventDefault(); //* formun otomatik gonderimini engelliyor.
  const value = grocery.value; //* form icindeki inputa yazilan degerleri aldik
  const id = new Date().getTime().toString(); //* benzersiz id olusturmak

  //Eger input bos degilse ve duzenleme modunda degilse ; calisacak blok yapisi
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); //yeni bir article etiketi olusturduk.
    let attr = document.createAttribute("data-id"); //yeni bir veri kimligi olusturduk
    attr.value = id;
    element.setAttributeNode(attr); //olusturulan id yi "article" elementine ekledik
    element.classList.add("grocery-item"); //olusturdugumuz article elementine class ekledik.
    element.innerHTML = `
           <p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
        `;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    //kapsayiciya olsutrudguumuz article etiketini ekledik.
    list.appendChild(element);
    displayAlert("Basariyla eklenildi.", "success");
    container.classList.add("show-container");
    //local storage a ekleme 
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    //Degistirecegimiz p etiketinin icerik kismina kullanicinin inputa girdigi degeri gonderdik.
    editElement.innerText = value;
    //Ekrana alert bastirdik
    displayAlert("Deger Degistirildi", "success");
   
    setBackToDefault();
  }
};

const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling; //buttonun kapsayicisindan sonra kapsayicinin kardes elementine eristik
  //tikladigim article etiketi icindeki p etiketinin textini iputa yolladik
  grocery.value = editElement.innerText;
  editFlag = true;
  editID = element.dataset.id; //duzenlenen ogenin kimligine erisme
  submitBtn.textContent = "Düzenle"; //duzenleme isleminde btn kisminin icerigini duzenledik.
};
const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  //listede oge varsa calisir
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));
  }
  //container yapisini gizleme
  container.classList.remove("show-container");
  displayAlert("Liste bos", "danger");
  setBackToDefault();
};
const createListItem = (id,value) =>{
  const element = document.createElement("article"); //yeni bir article etiketi olusturduk.
    let attr = document.createAttribute("data-id"); //yeni bir veri kimligi olusturduk
    attr.value = id;
    element.setAttributeNode(attr); //olusturulan id yi "article" elementine ekledik
    element.classList.add("grocery-item"); //olusturdugumuz article elementine class ekledik.
    element.innerHTML = `
           <p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
        `;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    //kapsayiciya olsutrudguumuz article etiketini ekledik.
    list.appendChild(element);
    displayAlert("Basariyla eklenildi.", "success");
    container.classList.add("show-container");
   
}
const setupItems = () => {
  let items = getLocalStorage();
  if(items.length >0 ){
    items.forEach((item)=>{
      createListItem(item.id,item.value)
    })
  }
}

//!OLAY IZLEYICILERI
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded",setupItems)

/* local storage  */
// yerel depoya öğe ekleme işlemi
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};
// yerel depodan öğeleri alma işlemi
const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};
// localStoragedan veriyi silme
const removeFromLocalStorage = (id) => {
  // localStorageda bulunan verileri getir
  let items = getLocalStorage();
  // tıkladığım etiketin idsi ile localStorageda ki id eşit değilse bunu diziden çıkar ve yeni bir elemana aktar
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};
// Yerel depoda update işlemi
const editLocalStorage = (id, value) => {
  let items = getLocalStorage();
  // yerel depodaki verilerin id ile güncellenecek olan verinin idsi biribirne eşit ise inputa girilen value değişkenini al
  // localStorageda bulunan verinin valuesuna aktar
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
};
//! Olay İzleyicileri
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);
