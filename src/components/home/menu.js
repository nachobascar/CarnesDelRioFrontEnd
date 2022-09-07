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
  const [maxStock, setMaxStock] = useState(false);

  const {currentUser} = useAuth();

  const handleQuantity = function(num, product) {
    if (productQuantity + num > product.stock) {
      setMaxStock(true);
      if (productQuantity > product.stock) {
        setProductQuantity(product.stock);
      }
    } else {
      setProductQuantity(prevCount => Math.max(1, prevCount + num));
      setMaxStock(false);
    }
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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, requestOptions);
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
      <div className="menu-page-open-item">
        <div className='container-fluid menu-page-item-description-container'>
          <div className="card mx-auto col-md-3 col-10 mt-5"> 
              <i className="menu-page-cross bi-x d-flex justify-content-end"></i>
              <img className='mx-auto img-thumbnail menu-page-item-image' src={product.image} width="auto" height="auto" />
              <div className="card-body text-center mx-auto menu-page-item-text">
                  <div className='cvp'>
                      <h5 className="card-title font-weight-bold">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                      <p className="card-text">${product.price.toLocaleString()}</p> 
                      {(currentUser && product.stock > 0) && 
                      <>
                        <div className="col"> <a className="cart-signs" onClick={() => handleQuantity(-1, product)}>-</a>&emsp; {productQuantity} &emsp;<a className="cart-signs" onClick={() => handleQuantity(1, product)}>+</a> </div>
                        {maxStock && <p className="card-text text-danger">Máximo stock alcanzado</p>}
                        <br/>
                        <a onClick={() => handleAddItem(product)} className="book-a-table-btn px-auto">AÑADIR</a>
                      </>}
                      {!product.stock && <p className="card-text">Sin stock</p>}
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
      setMaxStock(false);
    }
  
  }

  useEffect(() => {
    if (selectedItem) {
      handleClick(selectedItem, true);
    }
  }, [productQuantity, maxStock]);

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
      <section id="menu" className="menu section-bg">
        <div className="container" data-aos="fade-up">

          <div className="section-title">
            <h2>Menu</h2>
            <p>Check Our Tasty Menu</p>
          </div>

          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-12 d-flex justify-content-center">
              <ul id="menu-flters">
                <li data-filter="*" className="filter-active">All</li>
                {categories.map((category) => (
                  <li data-filter={`.filter-${category.name}`}>{category.name}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="row menu-container" data-aos="fade-up" data-aos-delay="200">

            {products.map((product) => (
              <div onClick={() => handleClick(product)} className={`col-lg-6 element-pointer menu-item ${product.Categories.map((category) => (`filter-${category.name}`)).join(' ')}`}>
                <img src={product.image} className="menu-img element-pointer" alt=""/>
                <div className="menu-content">
                  <a>{product.name}</a><span>${product.price.toLocaleString()}</span>
                </div>
                <div className="menu-ingredients">
                  {product.description}
                </div>
              </div>
            ))}             
            

          </div>

        </div>
      </section>

      {itemHtml}

      <section id="specials" className="specials">
        <div className="container" data-aos="fade-up">

          <div className="section-title">
            <h2>Specials</h2>
            <p>Check Our Specials</p>
          </div>

          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-3">
              <ul className="nav nav-tabs flex-column">
                <li className="nav-item">
                  <a className="nav-link active show" data-bs-toggle="tab" href="#tab-1">Modi sit est</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#tab-2">Unde praesentium sed</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#tab-3">Pariatur explicabo vel</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#tab-4">Nostrum qui quasi</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#tab-5">Iusto ut expedita aut</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-9 mt-4 mt-lg-0">
              <div className="tab-content">
                <div className="tab-pane active show" id="tab-1">
                  <div className="row">
                    <div className="col-lg-8 details order-2 order-lg-1">
                      <h3>Architecto ut aperiam autem id</h3>
                      <p className="fst-italic">Qui laudantium consequatur laborum sit qui ad sapiente dila parde sonata raqer a videna mareta paulona marka</p>
                      <p>Et nobis maiores eius. Voluptatibus ut enim blanditiis atque harum sint. Laborum eos ipsum ipsa odit magni. Incidunt hic ut molestiae aut qui. Est repellat minima eveniet eius et quis magni nihil. Consequatur dolorem quaerat quos qui similique accusamus nostrum rem vero</p>
                    </div>
                    <div className="col-lg-4 text-center order-1 order-lg-2">
                      <img src="assets/img/specials-1.png" alt="" className="img-fluid"/>
                    </div>
                  </div>
                </div>
                <div className="tab-pane" id="tab-2">
                  <div className="row">
                    <div className="col-lg-8 details order-2 order-lg-1">
                      <h3>Et blanditiis nemo veritatis excepturi</h3>
                      <p className="fst-italic">Qui laudantium consequatur laborum sit qui ad sapiente dila parde sonata raqer a videna mareta paulona marka</p>
                      <p>Ea ipsum voluptatem consequatur quis est. Illum error ullam omnis quia et reiciendis sunt sunt est. Non aliquid repellendus itaque accusamus eius et velit ipsa voluptates. Optio nesciunt eaque beatae accusamus lerode pakto madirna desera vafle de nideran pal</p>
                    </div>
                    <div className="col-lg-4 text-center order-1 order-lg-2">
                      <img src="assets/img/specials-2.png" alt="" className="img-fluid"/>
                    </div>
                  </div>
                </div>
                <div className="tab-pane" id="tab-3">
                  <div className="row">
                    <div className="col-lg-8 details order-2 order-lg-1">
                      <h3>Impedit facilis occaecati odio neque aperiam sit</h3>
                      <p className="fst-italic">Eos voluptatibus quo. Odio similique illum id quidem non enim fuga. Qui natus non sunt dicta dolor et. In asperiores velit quaerat perferendis aut</p>
                      <p>Iure officiis odit rerum. Harum sequi eum illum corrupti culpa veritatis quisquam. Neque necessitatibus illo rerum eum ut. Commodi ipsam minima molestiae sed laboriosam a iste odio. Earum odit nesciunt fugiat sit ullam. Soluta et harum voluptatem optio quae</p>
                    </div>
                    <div className="col-lg-4 text-center order-1 order-lg-2">
                      <img src="assets/img/specials-3.png" alt="" className="img-fluid"/>
                    </div>
                  </div>
                </div>
                <div className="tab-pane" id="tab-4">
                  <div className="row">
                    <div className="col-lg-8 details order-2 order-lg-1">
                      <h3>Fuga dolores inventore laboriosam ut est accusamus laboriosam dolore</h3>
                      <p className="fst-italic">Totam aperiam accusamus. Repellat consequuntur iure voluptas iure porro quis delectus</p>
                      <p>Eaque consequuntur consequuntur libero expedita in voluptas. Nostrum ipsam necessitatibus aliquam fugiat debitis quis velit. Eum ex maxime error in consequatur corporis atque. Eligendi asperiores sed qui veritatis aperiam quia a laborum inventore</p>
                    </div>
                    <div className="col-lg-4 text-center order-1 order-lg-2">
                      <img src="assets/img/specials-4.png" alt="" className="img-fluid"/>
                    </div>
                  </div>
                </div>
                <div className="tab-pane" id="tab-5">
                  <div className="row">
                    <div className="col-lg-8 details order-2 order-lg-1">
                      <h3>Est eveniet ipsam sindera pad rone matrelat sando reda</h3>
                      <p className="fst-italic">Omnis blanditiis saepe eos autem qui sunt debitis porro quia.</p>
                      <p>Exercitationem nostrum omnis. Ut reiciendis repudiandae minus. Omnis recusandae ut non quam ut quod eius qui. Ipsum quia odit vero atque qui quibusdam amet. Occaecati sed est sint aut vitae molestiae voluptate vel</p>
                    </div>
                    <div className="col-lg-4 text-center order-1 order-lg-2">
                      <img src="assets/img/specials-5.png" alt="" className="img-fluid"/>
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