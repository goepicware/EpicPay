/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import cookie from "react-cookies";
import { apiUrl, baseUrl, headerconfig } from "../Settings/Config";
import { showLoaderLst, hideLoaderLst } from "../Helpers/SettingHelper";
import OwlCarousel from "react-owl-carousel2";
import "../../common/css/owl.carousel.css";
import lik from "../../common/images/liked.svg";

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Epic",
      company_category: [],
      selected_cate_id: "",
      selected_category: [],
      selected_company: [],
      cat_api_status: [],
      company_id: "",
      company_app_id: "",
      company_logo: "",
      selectedcompany_data: "",
      cust_vstcompany: [],
    };

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    this.companyCategory();
    this.custCompany();
  }

  companyCategory() {
    showLoaderLst("catry-main-div", "class");
    let userId =
      cookie.load("UserId") != undefined ? cookie.load("UserId") : "";
    axios
      .get(
        apiUrl + "companycategory/categories?customer_id=" + userId,
        headerconfig
      )
      .then((res) => {
        hideLoaderLst("catry-main-div", "class");
        if (res.data.status === "ok") {
          this.setState(
            { company_category: res.data.result_set },
            function () {
              this.selectedCatIntl();
              this.setcatApicallStatus();
            }.bind(this)
          );
        } else {
          this.setState({ company_category: [] });
        }
      });
  }

  custCompany() {
    let userId =
      cookie.load("UserId") != undefined ? cookie.load("UserId") : "";
    axios
      .get(
        apiUrl + "customer/cust_vstcompany?customer_id=" + userId,
        headerconfig
      )
      .then((res) => {
        if (res.data.status === "ok") {
          this.setState({ cust_vstcompany: res.data.result_set });
        } else {
          this.setState({ cust_vstcompany: Array() });
        }
      });
  }

  custRvstCompanyHtml() {
    let custVstcompany = this.state.cust_vstcompany;
    if (Object.keys(custVstcompany).length > 0) {
      const custVstcompHtml = custVstcompany.map((company) => {
        return (
          <div
            className="img-round"
            onClick={this.selectedCompany.bind(this, company)}
          >
            <a href="javascript:void(0)">
              <img src={company.company_logo} />
            </a>
          </div>
        );
      });

      return <>{custVstcompHtml}</>;
    }
  }

  setcatApicallStatus() {
    let categoryList = this.state.company_category;
    let catApiStatus = Array();
    if (Object.keys(categoryList).length > 0) {
      const categoryHtml = categoryList.map((category, rwInt) => {
        catApiStatus[rwInt] = {
          catry_id: category.cate_id,
          apistatus: "initail",
          catdata: category,
          prodata: [],
        };
        return category;
      });
      this.setState({ cat_api_status: catApiStatus });
    }
  }

  selectedCatIntl() {
    let categoryList = this.state.company_category;
    if (Object.keys(categoryList).length > 0) {
      let selected_cate_id = categoryList[0].cate_id;
      this.setState({
        selected_category: categoryList[0],
        selected_cate_id: selected_cate_id,
        selected_company: categoryList[0].company,
      });
    }
  }

  selectedCat(category, event) {
    event.preventDefault();
    this.setState({
      selected_category: category,
      selected_cate_id: category.cate_id,
      selected_company: category.company,
    });
  }

  catListing() {
    let categoryList = this.state.company_category;
    let selected_cate_id = this.state.selected_cate_id;
    if (Object.keys(categoryList).length > 0) {
      const categoryHtml = categoryList.map((category, rwInt) => {
        let msnCls = category.cate_id == selected_cate_id ? "active" : "";
        return (
          <li
            className={msnCls}
            onClick={this.selectedCat.bind(this, category)}
          >
            <a href="javascript:void(0);">{category.cate_name}</a>
          </li>
        );
      });
      return <ul>{categoryHtml}</ul>;
    }
  }

  selectedCompany(company, event) {
    event.preventDefault();
    showLoaderLst("company-invl-div", "class");
    this.setState(
      {
        company_id: company.company_id,
        company_app_id: company.company_unquie_id,
        company_logo: company.company_logo,
        selectedcompany_data: company,
      },
      (() => {
        this.setSeletedCompany();
      }).bind(this)
    );
  }

  setSeletedCompany() {
    let company_id = this.state.company_id;
    let company_app_id = this.state.company_app_id;
    let company_logo = this.state.company_logo;
    let selectedcompany_data = this.state.selectedcompany_data;
    let categoryList = this.state.company_category;
    let catApiStatus = this.state.cat_api_status;
    localStorage.setItem("company_id", company_id);
    localStorage.setItem("company_app_id", company_app_id);
    localStorage.setItem("company_logo", company_logo);
    localStorage.setItem(
      "selectedcompany_data",
      JSON.stringify(selectedcompany_data)
    );
    localStorage.setItem("categoryList", JSON.stringify(categoryList));
    localStorage.setItem("catApiStatus", JSON.stringify(catApiStatus));
    setTimeout(function () {
      window.location.href = baseUrl + "myaccount";
      //window.location.href = baseUrl+"vouchers";
    }, 0);
  }

  companyListing() {
    let companyList = this.state.selected_company;
    if (Object.keys(companyList).length > 0) {
      const companyHtml = companyList.map((company) => {
        return (
          <li onClick={this.selectedCompany.bind(this, company)}>
            <a href={void 0} className="love-it">
              <img src={lik} />
            </a>
            <a href={void 0} className="main-cover">
              <div className="cover-image">
                <img src={company.company_logo} />
              </div>
              <p>{company.company_name}</p>
            </a>
            {company.customer_mapped == "yes" && (
              <div className="color-tag">Visited</div>
            )}
          </li>
        );
      });
      return <ul className="company-invl-div">{companyHtml}</ul>;
    }
  }

  render() {
    let custRvstcompany = this.state.cust_vstcompany;
    let loopStatus = Object.keys(custRvstcompany).length > 4 ? true : false;
    var foodbanner = {
      items: 4,
      loop: loopStatus,
      dots: true,
      nav: false,
      margin: 10,
      stagePadding: 30,
    };

    return (
      <div className="main-div catry-main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container">
            <br></br>

            {Object.keys(custRvstcompany).length > 0 && (
              <div className="che-slider">
                <h3>Recent visits</h3>
                <OwlCarousel options={foodbanner}>
                  {this.custRvstCompanyHtml()}
                </OwlCarousel>
              </div>
            )}

            <div className="fav-tab">
              <div className="fav-tab-nav">{this.catListing()}</div>
              <div className="fav-tab-content">{this.companyListing()}</div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default Company;
