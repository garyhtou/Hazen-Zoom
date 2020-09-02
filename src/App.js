import React from "react";
import "./App.css";

import firebase from "./firebase";
import moment from "moment";

import { Layout, Button, notification } from "antd";
import { GithubOutlined } from "@ant-design/icons";

const { Content, Footer, Header } = Layout;

class App extends React.Component {
	constructor(props) {
		super(props);

		var path = window.location.pathname;

		this.state = {
			home: path === "/",
			loading: true,
			data: {},
			error: false,
			myTeachers: {
				Home: "",
				P1: "",
				P2: "",
				P3: "",
				P4: "",
				P5: "",
			},
			myLinks: {
				Home: "#",
				P1: "#",
				P2: "#",
				P3: "#",
				P4: "#",
				P5: "#",
			},
			currPeriod: "Home",
		};
	}

	periodMap = {
		Home: "Advisory/Homeroom",
		P1: "Period 1",
		P2: "Period 2",
		P3: "Period 3",
		P4: "Period 4",
		P5: "Period 5",
	};

	periodTime = {
		Home: {
			Monday: {
				start: moment("08:30", "HH:mm"),
				end: moment("09:00", "HH:mm"),
			},
			Tuesday: {
				start: moment("08:30", "HH:mm"),
				end: moment("09:00", "HH:mm"),
			},
			Wednesday: {
				start: moment("08:30", "HH:mm"),
				end: moment("09:00", "HH:mm"),
			},
			Thursday: {
				start: moment("08:30", "HH:mm"),
				end: moment("09:00", "HH:mm"),
			},
			Friday: {
				start: null,
				end: null,
			},
		},
		P1: {
			Monday: {
				start: moment("09:00", "HH:mm"),
				end: moment("10:00", "HH:mm"),
			},
			Tuesday: {
				start: moment("09:00", "HH:mm"),
				end: moment("10:00", "HH:mm"),
			},
			Wednesday: {
				start: moment("09:00", "HH:mm"),
				end: moment("10:00", "HH:mm"),
			},
			Thursday: {
				start: moment("09:00", "HH:mm"),
				end: moment("10:00", "HH:mm"),
			},
			Friday: {
				start: moment("10:00", "HH:mm"),
				end: moment("10:30", "HH:mm"),
			},
		},
		P2: {
			Monday: {
				start: moment("10:00", "HH:mm"),
				end: moment("11:00", "HH:mm"),
			},
			Tuesday: {
				start: moment("10:00", "HH:mm"),
				end: moment("11:00", "HH:mm"),
			},
			Wednesday: {
				start: moment("10:00", "HH:mm"),
				end: moment("11:00", "HH:mm"),
			},
			Thursday: {
				start: moment("10:00", "HH:mm"),
				end: moment("11:00", "HH:mm"),
			},
			Friday: {
				start: moment("10:30", "HH:mm"),
				end: moment("11:00", "HH:mm"),
			},
		},
		P3: {
			Monday: {
				start: moment("11:00", "HH:mm"),
				end: moment("12:00", "HH:mm"),
			},
			Tuesday: {
				start: moment("11:00", "HH:mm"),
				end: moment("12:00", "HH:mm"),
			},
			Wednesday: {
				start: moment("11:00", "HH:mm"),
				end: moment("12:00", "HH:mm"),
			},
			Thursday: {
				start: moment("11:00", "HH:mm"),
				end: moment("12:00", "HH:mm"),
			},
			Friday: {
				start: moment("11:00", "HH:mm"),
				end: moment("11:30", "HH:mm"),
			},
		},
		P4: {
			Monday: {
				start: moment("13:00", "HH:mm"),
				end: moment("14:00", "HH:mm"),
			},
			Tuesday: {
				start: moment("13:00", "HH:mm"),
				end: moment("14:00", "HH:mm"),
			},
			Wednesday: {
				start: moment("13:00", "HH:mm"),
				end: moment("14:00", "HH:mm"),
			},
			Thursday: {
				start: moment("13:00", "HH:mm"),
				end: moment("14:00", "HH:mm"),
			},
			Friday: {
				start: moment("13:30", "HH:mm"),
				end: moment("14:00", "HH:mm"),
			},
		},
		P5: {
			Monday: {
				start: moment("14:00", "HH:mm"),
				end: moment("15:00", "HH:mm"),
			},
			Tuesday: {
				start: moment("14:00", "HH:mm"),
				end: moment("15:00", "HH:mm"),
			},
			Wednesday: {
				start: moment("14:00", "HH:mm"),
				end: moment("15:00", "HH:mm"),
			},
			Thursday: {
				start: moment("14:00", "HH:mm"),
				end: moment("15:00", "HH:mm"),
			},
			Friday: {
				start: moment("14:00", "HH:mm"),
				end: moment("14:30", "HH:mm"),
			},
		},
	};

	componentDidMount() {
		var hazenZoom =
			"https://hazen.rentonschools.us/class-of-2020/links-to-zoom-classrooms";
		var corsAnywhere = "https://cors-anywhere.herokuapp.com/";

		fetch(corsAnywhere + hazenZoom)
			.then((response) => response.text())
			.then((response) => {
				var parser = new DOMParser();
				var html = parser.parseFromString(response, "text/html");
				console.log(html);

				var data = {
					teachers: {},
					periods: { Home: [], P1: [], P2: [], P3: [], P4: [], P5: [] },
				};

				var teachersElements = html.querySelectorAll(".fsPanel");
				for (var teacherElement of teachersElements) {
					var name = teacherElement.querySelector("h2.fsElementTitle a")
						.innerText;
					var linkElements = teacherElement.querySelectorAll(
						"div.fsElementContent div.fsContent div.fsElementContent p"
					);
					var links = {
						Home: "#",
						P1: "#",
						P2: "#",
						P3: "#",
						P4: "#",
						P5: "#",
					};

					for (var periodElement of linkElements) {
						var link = periodElement.querySelector("a");
						if (link !== null) {
							switch (link.innerText) {
								case this.periodMap.Home:
									links.Home = link.href;
									data.periods.Home.push(name);
									break;
								case this.periodMap.P1:
									links.P1 = link.href;
									data.periods.P1.push(name);
									break;
								case this.periodMap.P2:
									links.P2 = link.href;
									data.periods.P2.push(name);
									break;
								case this.periodMap.P3:
									links.P3 = link.href;
									data.periods.P3.push(name);
									break;
								case this.periodMap.P4:
									links.P4 = link.href;
									data.periods.P4.push(name);
									break;
								case this.periodMap.P4:
									links.P4 = link.href;
									data.periods.P5.push(name);
									break;
								case this.periodMap.P5:
									links.P5 = link.href;
									data.periods.P5.push(name);
									break;
							}
						}
					}
					data.teachers[name] = { name, links };
				}

				console.log(data);
				this.setState({ data });
				if (this.state.home) {
					this.setState({ loading: false });
				} else {
					firebase
						.database()
						.ref("registrations/" + window.location.pathname)
						.once(
							"value",
							function (snapshot) {
								if (snapshot.exists()) {
									var myTeachers = snapshot.val();
									var links = {
										Home: "#",
										P1: "#",
										P2: "#",
										P3: "#",
										P4: "#",
										P5: "#",
									};

									for (let period in myTeachers) {
										if (myTeachers[period] !== "") {
											links[period] = this.state.data.teachers[
												myTeachers[period]
											].links[period];
										}
									}
									this.setState({
										myTeachers,
										loading: false,
										myLinks: links,
									});
									console.log(links);
								} else {
									this.setState({ error: true, loading: false });
								}
							}.bind(this)
						);

					this.updateCurrClass();
				}
			})
			.catch((err) => {
				notification.open({
					type: "error",
					message: "Error",
					description: <p>{err.toString()}</p>,
				});
			});
	}

	updateCurrClass() {
		var dayOfWeek = moment(new Date()).format("dddd");
		for (var period in this.periodTime) {
			var periodDoW = this.periodTime[period][dayOfWeek];
			if (periodDoW !== null) {
				var start = moment(
					moment(new Date()).format("YYYY-MM-DD") +
						" " +
						periodDoW.start.format("HH:mm"),
					"YYYY-MM-DD HH:mm"
				);
				var end = moment(
					moment(new Date()).format("YYYY-MM-DD") +
						" " +
						periodDoW.end.format("HH:mm"),
					"YYYY-MM-DD HH:mm"
				);
				var currentDate = moment(new Date());
				// var currentDate = moment("2020-09-02 10:30", "YYYY-MM-DD HH:mm");
				if (currentDate.isBetween(start, end)) {
					console.log("CURRENTLY: " + period);
					this.setState({ currPeriod: period });
				} else {
					this.setState({ currPeriod: null });
				}
			}
		}
	}

	render() {
		return (
			<Layout style={{ minHeight: "100vh" }}>
				<Header>
					<h1 style={{ color: "white" }}>Zoom to Class</h1>
				</Header>
				<Content style={{ padding: "2vw" }}>
					{this.state.home ? (
						<>{JSON.stringify(this.state.data)}</>
					) : (
						<>
							{this.state.loading ? (
								<div>loading</div>
							) : (
								<>
									{!this.state.error ? (
										<>
											<div className="user-flex">
												<div className="user-flexSide">
													{this.state.currPeriod === null ? (
														<p>no class</p>
													) : (
														<Button
															className="user-joinNowButton"
															href={this.state.myLinks[this.state.currPeriod]}
														>
															left
														</Button>
													)}
												</div>
												<div className="user-flexSide">
													{Object.keys(this.state.myLinks).map((key) => (
														<Button
															type="primary"
															href={this.state.myLinks[key]}
														>
															{key}: Join {this.state.myTeachers[key]}'s Zoom
														</Button>
													))}
												</div>
											</div>
										</>
									) : (
										<div>error</div>
									)}
								</>
							)}
						</>
					)}
				</Content>
				<Footer style={{ textAlign: "center" }}>
					<a className="gh-link" href="https://github.com/garytou2/">
						{/* TODO UPDATE GH LINK */}
						Zoom to Class <GithubOutlined />
					</a>
					<span className="credit-sep">|</span>
					Developed by <a href="https://garytou.com">Gary Tou</a>
				</Footer>
			</Layout>
		);
	}
}

export default App;
