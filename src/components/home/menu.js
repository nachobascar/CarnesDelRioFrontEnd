import React, {Component, useState, useEffect} from 'react';

import useAuth from '../../hooks/useAuth';


const select = (el, all = false) => {
  el = el.trim()
  if (all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

/**
 * Easy event listener function
 */
const on = (type, el, listener, all = false) => {
  let selectEl = select(el, all)
  if (selectEl) {
    if (all) {
      selectEl.forEach(e => e.addEventListener(type, listener))
    } else {
      selectEl.addEventListener(type, listener)
    }
  }
}




const Menu = function({setCart}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [itemHtml, setItemHtml] = useState(<></>);
  const [selectedItem, setSelectedItem] = useState(null);

  const {currentUser} = useAuth();

  const handleQuantity = function(num) {
    setProductQuantity(prevCount => Math.max(1, prevCount + num));
  }

  const handleAddItem = async function(item) {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': currentUser.token_type + ' ' + currentUser.access_token
        },
        body: JSON.stringify({
          productId: item.id,
          quantity: productQuantity
        }),
    };
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, requestOptions);
        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        setCart(await response.json());
        handleClick();
    } catch (error) {
        console.log(error);
    } 
  }


  const popupItem = function(product) {
    setItemHtml( 
      <div class="menu-page-open-item">
        <div class='container-fluid menu-page-item-description-container'>
          <div class="card mx-auto col-md-3 col-10 mt-5"> 
              <i class="menu-page-cross bi-x d-flex justify-content-end"></i>
              <img class='mx-auto img-thumbnail menu-page-item-image' src={product.image} width="auto" height="auto" />
              <div class="card-body text-center mx-auto menu-page-item-text">
                  <div class='cvp'>
                      <h5 class="card-title font-weight-bold">{product.name}</h5>
                      <p class="card-text">{product.description}</p>
                      <p class="card-text">${product.price.toLocaleString()}</p> 
                      {currentUser && 
                      <>
                        <div class="col"> <a class="cart-signs" onClick={() => handleQuantity(-1)}>-</a>&emsp; {productQuantity} &emsp;<a class="cart-signs" onClick={() => handleQuantity(1)}>+</a> </div>
                        <br/>
                        <a onClick={() => handleAddItem(product)} class="book-a-table-btn px-auto">AÑADIR</a>
                      </>}
                  </div>
              </div>
          </div>
        </div>
      </div>
    );
  }

  const handleClick = function handleClick(product, rerender=false) {
    
    if (!select('.menu-page-open-item') || rerender) { 
      setSelectedItem(product);
      popupItem(product);
    } else {
      setSelectedItem(null);
      setItemHtml(<></>);
      setProductQuantity(1);
    }
  
  }

  useEffect(() => {
    if (selectedItem) {
      handleClick(selectedItem, true);
    }
  }, [productQuantity]);

  useEffect(() => {
    if (select('.menu-page-open-item')) {
        select('.menu-page-open-item').addEventListener('click', function(event) {
          if (!select('.menu-page-item-image').contains(event.target) && !select('.menu-page-item-text').contains(event.target)) {
            handleClick();
          }
        });
    }

  }, [itemHtml]);

  useEffect(() => {
    let menuContainer = select('.menu-container');
    if (menuContainer) {
      let menuIsotope = new Isotope(menuContainer, {
        itemSelector: '.menu-item',
        layoutMode: 'fitRows'
      });

      let menuFilters = select('#menu-flters li', true);

      on('click', '#menu-flters li', function(e) {
        e.preventDefault();
        menuFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        menuIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        menuIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }
  
  }, [products, categories]);

  useEffect(() => {

    // sort array by name property
    const sortedProducts = (a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    };

    const requestOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    fetch(`${process.env.REACT_APP_API_URL}/products`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                console.log("Error al verificar el usuario");
                console.log(response);
                throw response;
            }
            response.json().then((products) => {
                setProducts(products.sort(sortedProducts));
            });
        })
        .catch((error) => {
            console.log(error);
        });
    fetch(`${process.env.REACT_APP_API_URL}/categories`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                console.log("Error al verificar el usuario");
                console.log(response);
                throw response;
            }
            response.json().then((categories) => {
                setCategories(categories.sort(sortedProducts));
            });
        })
        .catch((error) => {
            console.log(error);
        });
  }, []);

  return (
      <>
      <section id="menu" class="menu section-bg">
        <div class="container" data-aos="fade-up">

          <div class="section-title">
            <h2>Menu</h2>
            <p>Check Our Tasty Menu</p>
          </div>

          <div class="row" data-aos="fade-up" data-aos-delay="100">
            <div class="col-lg-12 d-flex justify-content-center">
              <ul id="menu-flters">
                <li data-filter="*" class="filter-active">All</li>
                {categories.map((category) => (
                  <li data-filter={`.filter-${category.name}`}>{category.name}</li>
                ))}
              </ul>
            </div>
          </div>

          <div class="row menu-container" data-aos="fade-up" data-aos-delay="200">

            {products.map((product) => (
              <div onClick={() => handleClick(product)} class={`col-lg-6 element-pointer menu-item ${product.Categories.map((category) => (`filter-${category.name}`)).join(' ')}`}>
                <img src={product.image} class="menu-img element-pointer" alt=""/>
                <div class="menu-content">
                  <a>{product.name}</a><span>${product.price.toLocaleString()}</span>
                </div>
                <div class="menu-ingredients">
                  {product.description}
                </div>
              </div>
            ))}             
            

          </div>

        </div>
      </section>

      {itemHtml}

      <section id="specials" class="specials">
        <div class="container" data-aos="fade-up">

          <div class="section-title">
            <h2>Specials</h2>
            <p>Check Our Specials</p>
          </div>

          <div class="row" data-aos="fade-up" data-aos-delay="100">
            <div class="col-lg-3">
              <ul class="nav nav-tabs flex-column">
                <li class="nav-item">
                  <a class="nav-link active show" data-bs-toggle="tab" href="#tab-1">Modi sit est</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-bs-toggle="tab" href="#tab-2">Unde praesentium sed</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-bs-toggle="tab" href="#tab-3">Pariatur explicabo vel</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-bs-toggle="tab" href="#tab-4">Nostrum qui quasi</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-bs-toggle="tab" href="#tab-5">Iusto ut expedita aut</a>
                </li>
              </ul>
            </div>
            <div class="col-lg-9 mt-4 mt-lg-0">
              <div class="tab-content">
                <div class="tab-pane active show" id="tab-1">
                  <div class="row">
                    <div class="col-lg-8 details order-2 order-lg-1">
                      <h3>Architecto ut aperiam autem id</h3>
                      <p class="fst-italic">Qui laudantium consequatur laborum sit qui ad sapiente dila parde sonata raqer a videna mareta paulona marka</p>
                      <p>Et nobis maiores eius. Voluptatibus ut enim blanditiis atque harum sint. Laborum eos ipsum ipsa odit magni. Incidunt hic ut molestiae aut qui. Est repellat minima eveniet eius et quis magni nihil. Consequatur dolorem quaerat quos qui similique accusamus nostrum rem vero</p>
                    </div>
                    <div class="col-lg-4 text-center order-1 order-lg-2">
                      <img src="assets/img/specials-1.png" alt="" class="img-fluid"/>
                    </div>
                  </div>
                </div>
                <div class="tab-pane" id="tab-2">
                  <div class="row">
                    <div class="col-lg-8 details order-2 order-lg-1">
                      <h3>Et blanditiis nemo veritatis excepturi</h3>
                      <p class="fst-italic">Qui laudantium consequatur laborum sit qui ad sapiente dila parde sonata raqer a videna mareta paulona marka</p>
                      <p>Ea ipsum voluptatem consequatur quis est. Illum error ullam omnis quia et reiciendis sunt sunt est. Non aliquid repellendus itaque accusamus eius et velit ipsa voluptates. Optio nesciunt eaque beatae accusamus lerode pakto madirna desera vafle de nideran pal</p>
                    </div>
                    <div class="col-lg-4 text-center order-1 order-lg-2">
                      <img src="assets/img/specials-2.png" alt="" class="img-fluid"/>
                    </div>
                  </div>
                </div>
                <div class="tab-pane" id="tab-3">
                  <div class="row">
                    <div class="col-lg-8 details order-2 order-lg-1">
                      <h3>Impedit facilis occaecati odio neque aperiam sit</h3>
                      <p class="fst-italic">Eos voluptatibus quo. Odio similique illum id quidem non enim fuga. Qui natus non sunt dicta dolor et. In asperiores velit quaerat perferendis aut</p>
                      <p>Iure officiis odit rerum. Harum sequi eum illum corrupti culpa veritatis quisquam. Neque necessitatibus illo rerum eum ut. Commodi ipsam minima molestiae sed laboriosam a iste odio. Earum odit nesciunt fugiat sit ullam. Soluta et harum voluptatem optio quae</p>
                    </div>
                    <div class="col-lg-4 text-center order-1 order-lg-2">
                      <img src="assets/img/specials-3.png" alt="" class="img-fluid"/>
                    </div>
                  </div>
                </div>
                <div class="tab-pane" id="tab-4">
                  <div class="row">
                    <div class="col-lg-8 details order-2 order-lg-1">
                      <h3>Fuga dolores inventore laboriosam ut est accusamus laboriosam dolore</h3>
                      <p class="fst-italic">Totam aperiam accusamus. Repellat consequuntur iure voluptas iure porro quis delectus</p>
                      <p>Eaque consequuntur consequuntur libero expedita in voluptas. Nostrum ipsam necessitatibus aliquam fugiat debitis quis velit. Eum ex maxime error in consequatur corporis atque. Eligendi asperiores sed qui veritatis aperiam quia a laborum inventore</p>
                    </div>
                    <div class="col-lg-4 text-center order-1 order-lg-2">
                      <img src="assets/img/specials-4.png" alt="" class="img-fluid"/>
                    </div>
                  </div>
                </div>
                <div class="tab-pane" id="tab-5">
                  <div class="row">
                    <div class="col-lg-8 details order-2 order-lg-1">
                      <h3>Est eveniet ipsam sindera pad rone matrelat sando reda</h3>
                      <p class="fst-italic">Omnis blanditiis saepe eos autem qui sunt debitis porro quia.</p>
                      <p>Exercitationem nostrum omnis. Ut reiciendis repudiandae minus. Omnis recusandae ut non quam ut quod eius qui. Ipsum quia odit vero atque qui quibusdam amet. Occaecati sed est sint aut vitae molestiae voluptate vel</p>
                    </div>
                    <div class="col-lg-4 text-center order-1 order-lg-2">
                      <img src="assets/img/specials-5.png" alt="" class="img-fluid"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
        
      </>  
  );
} 
export default Menu;