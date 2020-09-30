import React from "react";
import axios from "axios";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import Loader from "./components/loader";
import Header from "./components/header";
import Papa from "papaparse";
import urlRegex from "url-regex";
import socketIOClient from "socket.io-client";
import { ExportReactCSV } from "./components/exportCsv";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
const socket = socketIOClient("http://ti-dev001.taboolasyndication.com:5120");

// import FormData from 'form-data';
class MainForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      valid: true,
      loading: false,
      data: [],
      csvfile: undefined,
      export: false,
      task: "single",
    };
    this.filesInput = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateData = this.updateData.bind(this);
  }
  static defaultProps = {
    color: "#29D",
    startPosition: 0.0,
    stopDelayMs: 200,
    height: 3,
  };
  
  errorAlert = (e) => toast.error(e, { position: toast.POSITION.TOP_CENTER });
  
  timer = null;

  routeChangeStart = () => {
    NProgress.set(this.props.startPosition);
    NProgress.start();
  }

  routeChangeEnd = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      NProgress.done(true);
    }, this.props.stopDelayMs);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
      valid: this.getValidationState() === "success",
    });
  }

  getValidationState() {
    if (this.state.value.length <= 0) return null;
    return this.state.value.match(/((http|https):\/\/www\.)?.+\..+/)
      ? "success"
      : "error";
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.getValidationState() === "success") {
      this.setState({ loading: true, export: false });
      //let data = JSON.stringify({ url: this.state.value });
      let data = this.state.value;
      socket.emit("sendUrl", data);
      //axios
        //.post("/url", data, {
          //headers: {
           // "Content-Type": "application/json",
        //  },
        //})
        //.then((res) => {
         // console.log(res);
          //if (res.data.error && res.status === 200) {
           // this.errorAlert(res.data.error);
          //}
          //this.setState({ loading: false, value: "", data: res.data });
        //})
        //.catch(function (error) {
         // window.location = "/error";
        //});
    } else {
      this.errorAlert("Please enter a valid URL");
      return;
    }
  }

  handleFchange = (event) => {
    this.setState({
      csvfile: event.target.files[0],
      task: "multiple",
    });
  }

  importCSV = (e) => {
    e.preventDefault();

    const { csvfile } = this.state;
    //console.log(csvfile);
    if (csvfile !== undefined) {
      let reg = /(\.csv)$/i;
      if (reg.exec(this.state.csvfile.name)) {
        this.setState({ csvfile: undefined, data: [] });
        Papa.parse(csvfile, {
          complete: this.updateData,
          header: true,
        });
      } else {
        this.errorAlert("Please upload a CSV file.");

        return false;
      }
    } else {
      this.errorAlert("Please upload a csv file.");

      return false;
    }
  }

  updateData(result) {
    const { options } = this.props;

    if (options) {
      NProgress.configure(options);
    }

    let data = result.data;
    if ("Url" in data[0]) {
      this.setState({ loading: true });
      this.routeChangeStart();
      const urls = data
        .map((e) => e.Url.match(urlRegex({ exact: false })))
        .flat(1)
        .filter((e) => e);
      const urlsUnique = [...new Set(urls)];
      const notify = (e) =>
        toast.info(e, { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
      notify(`Total Number of Urls ${urlsUnique.length}`);
      socket.emit("sendUrls", urlsUnique);
    } else {
      this.errorAlert(
        "Please add 'Url' name to column which contains Urls in CSV File"
      );

      return;
    }
  }

  handleClick = (event) => {
    this.filesInput.current.click();
    //console.log(csvfile);
  }

  componentDidMount() {
    socket.on("error", (error) => this.errorAlert(error));

    socket.on("sendResult", (data) => {
      //console.log(data.length, "data-length");
      this.setState({
        loading: false,
        value: "",
        data: [...this.state.data, ...data],
      });
    });

    socket.on("sendSingleResult", (data) => {
      //console.log(data.length, "data-length");
      this.setState({
        loading: false,
        value: "",
        data: [data],
      });
    });
    socket.on("end", (data) => {
      this.setState({ export: true, task: "single" });
      this.routeChangeEnd();
      const alertSuccess = (e) =>
        toast.success(e, { position: toast.POSITION.TOP_RIGHT });
      alertSuccess(data);
      return false;
    });
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  render() {
    const data = this.state.data;
    const columns = [
      {
        name: "Url",
        selector: "url",
        sortable: true,
        maxWidth: "500px",
      },
      {
        name: "Result",
        selector: "result",
        sortable: true,
        right: true,
        style: {
          textTransform: "capitalize",
        },
      },
    ];

    const customStyles = {
      header: {
        style: {
          background: "transparent",
          color: "white",
        },
      },
      headRow: {
        style: {
          background: "grey",
        },
      },
    };

    console.log(data);
    return (
      <div>
        <Header />
        <ToastContainer />
        <div className="container maincol">
          <div className="row">
            <div className="col-sm-12">
              <div className="MainForm">
                <div className="Instructions">
                  <div className="Input">
                    <form onSubmit={this.handleSubmit}>
                      <div className="bgblack">
                        <div className="form-inputs">
                          <FormGroup
                            bsSize="large"
                            validationState={this.getValidationState()}
                          >
                            <FormControl
                              type="text"
                              value={this.state.value}
                              placeholder="Enter Url To Check Taboola Codes"
                              onChange={this.handleChange}
                              required="required"
                            />
                          </FormGroup>

                          <FormGroup>
                            <Button
                              className="uploadbtn"
                              onClick={this.handleClick}
                            >
                              {this.state.csvfile !== undefined
                                ? `${this.state.csvfile.name}`
                                : "Upload CSV file"}
                            </Button>

                            <input
                              type="file"
                              ref={this.filesInput}
                              name="file"
                              placeholder={null}
                              onChange={this.handleFchange}
                              size="60"
                              style={{ display: "none" }}
                            />
                          </FormGroup>
                        </div>
                        <div>
                          <p className="head2">
                            For sample CSV file{" "}
                            <a href="/Sample-file1.csv" download>
                              <b>Click Here</b>
                            </a>{" "}
                          </p>
                          <Button
                            bsSize="large"
                            bsStyle="primary"
                            type="submit"
                            onClick={
                              this.state.task === "single"
                                ? this.handleSubmit
                                : this.importCSV
                            }
                            disabled={
                              this.state.value === "" &&
                              this.state.csvfile === undefined
                            }
                          >
                            Check Taboola Codes
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!this.state.loading ? (
          data.length !== 0 ? (
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  {this.state.export && data.length !== 0 ? (
                    <ExportReactCSV
                      csvData={this.state.data}
                      fileName={"result.csv"}
                    />
                  ) : null}
                  <DataTable
                    title="Results"
                    columns={columns}
                    data={data}
                    pagination
                    customStyles={customStyles}
                    highlightOnHover
                    responsive
                    noHeader
                    striped
                    theme="dark"
                  />
                </div>
              </div>
            </div>
          ) : null
        ) : (
          <div className="cstloader">
            <Loader />
          </div>
        )}
      </div>
    );
  }
}
MainForm.propTypes = {
  color: PropTypes.string,
  startPosition: PropTypes.number,
  stopDelayMs: PropTypes.number,
  options: PropTypes.object,
};
export default MainForm;
