import React, {Component} from 'react';

class Home extends Component {
  render() {
    return (
      <div>
        <section id="hero" class="d-flex align-items-center">
          <div class="container position-relative text-center text-lg-start" data-aos="zoom-in" data-aos-delay="100">
            <div class="row">
              <div class="col-lg-8">
                <h1>Welcome to <span>Restaurantly</span></h1>
                <h2>Delivering great food for more than 18 years!</h2>

                <div class="btns">
                  <a href="#menu" class="btn-menu animated fadeInUp scrollto">Our Menu</a>
                  <a href="#book-a-table" class="btn-book animated fadeInUp scrollto">Book a Table</a>
                </div>
              </div>
              <div class="col-lg-4 d-flex align-items-center justify-content-center position-relative" data-aos="zoom-in" data-aos-delay="200">
                <a href="https://www.youtube.com/watch?v=u6BOC7CDUTQ" class="glightbox play-btn"></a>
              </div>

            </div>
          </div>
        </section>
        <main id="main">
          <section id="about" class="about">
            <div class="container" data-aos="fade-up">

              <div class="row">
                <div class="col-lg-6 order-1 order-lg-2" data-aos="zoom-in" data-aos-delay="100">
                  <div class="about-img">
                    <img src="assets/img/about.jpg" alt=""/>
                  </div>
                </div>
                <div class="col-lg-6 pt-4 pt-lg-0 order-2 order-lg-1 content">
                  <h3>Voluptatem dignissimos provident quasi corporis voluptates sit assumenda.</h3>
                  <p class="fst-italic">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua.
                  </p>
                  <ul>
                    <li><i class="bi bi-check-circle"></i> Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                    <li><i class="bi bi-check-circle"></i> Duis aute irure dolor in reprehenderit in voluptate velit.</li>
                    <li><i class="bi bi-check-circle"></i> Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate trideta storacalaperda mastiro dolore eu fugiat nulla pariatur.</li>
                  </ul>
                  <p>
                    Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum
                  </p>
                </div>
              </div>

            </div>
          </section>

          <section id="why-us" class="why-us">
            <div class="container" data-aos="fade-up">

              <div class="section-title">
                <h2>Why Us</h2>
                <p>Why Choose Our Restaurant</p>
              </div>

              <div class="row">

                <div class="col-lg-4">
                  <div class="box" data-aos="zoom-in" data-aos-delay="100">
                    <span>01</span>
                    <h4>Lorem Ipsum</h4>
                    <p>Ulamco laboris nisi ut aliquip ex ea commodo consequat. Et consectetur ducimus vero placeat</p>
                  </div>
                </div>

                <div class="col-lg-4 mt-4 mt-lg-0">
                  <div class="box" data-aos="zoom-in" data-aos-delay="200">
                    <span>02</span>
                    <h4>Repellat Nihil</h4>
                    <p>Dolorem est fugiat occaecati voluptate velit esse. Dicta veritatis dolor quod et vel dire leno para dest</p>
                  </div>
                </div>

                <div class="col-lg-4 mt-4 mt-lg-0">
                  <div class="box" data-aos="zoom-in" data-aos-delay="300">
                    <span>03</span>
                    <h4> Ad ad velit qui</h4>
                    <p>Molestiae officiis omnis illo asperiores. Aut doloribus vitae sunt debitis quo vel nam quis</p>
                  </div>
                </div>

              </div>

            </div>
          </section>
        </main>
      </div>
    );
  }
} export default Home;